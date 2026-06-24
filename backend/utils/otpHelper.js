const nodemailer = require("nodemailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };

    const mailOptions = {
        from: `"FinTrack Auth" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subjects[purpose] || "Verification Code",
        html: `
            <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2>Security Verification</h2>
                <p>Your verification code for <strong>${purpose}</strong> is:</p>
                <h1 style="background: #f4f4f5; padding: 10px; text-align: center; letter-spacing: 4px; color: #2563eb;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };