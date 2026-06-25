const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../utils/otpHelper");

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                await User.deleteOne({ email });
            } else {
                return res.status(400).json({ message: "User already exists" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user = new User({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            otpPurpose: "signup"
        });

        await user.save();

        // Safe isolation for email service to avoid hanging states
        try {
            await sendOTPEmail(email, otp, "signup");
        } catch (emailError) {
            console.error("Critical Nodemailer Error:", emailError.message);
            return res.status(201).json({ 
                message: "User registered in DB, but email delivery failed. Check SMTP credentials.",
                otp: process.env.NODE_ENV === "development" ? otp : undefined 
            });
        }

        res.status(200).json({ message: "OTP sent to email for verification" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;

        // Ensure string configuration is uniform
        const normalizedPurpose = purpose ? purpose.toLowerCase() : "signup";

        const user = await User.findOne({ email, otpPurpose: normalizedPurpose });
        if (!user) {
            return res.status(404).json({ message: "Invalid request or session expired" });
        }

        if (user.otp !== otp || new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (normalizedPurpose === "signup") {
            user.isVerified = true;
            user.otp = null;
            user.otpExpiry = null;
            user.otpPurpose = null;
            await user.save();
            return res.status(200).json({ message: "Signup successful" });
        }

        res.status(200).json({ message: "OTP verified. Proceed to change password." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otpPurpose = "reset-password";

        await user.save();

        try {
            await sendOTPEmail(email, otp, "reset-password");
        } catch (emailError) {
            console.error("Nodemailer ForgotPassword Error:", emailError.message);
            return res.status(500).json({ message: "Database updated, but failed to send verification email." });
        }

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, otpPurpose: "reset-password" });

        if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpiry = null;
        user.otpPurpose = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};