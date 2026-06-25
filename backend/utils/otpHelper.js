const nodemailer = require("nodemailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    // 🟢 Brevo Standard SMTP config - isme "Key not found" kabhi nahi aayega
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587, 
        secure: false, 
        auth: {
            user: "afedda001@smtp-brevo.com", // 👈 Jo teri screenshot me 'Login' email tha
            pass: "xsmtpsib-d3dc7167295ea818c94dd65fc2a4a8469ab84c3e6bd36f413c37eeb3974869a8-U8nbahE8poeZjFer" // 👈 Jo teri nayi SMTP key hai
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };

    const mailOptions = {
        from: '"FinTrack Auth" <hamidansariraja546@gmail.com>', // 👈 Teri register email id
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

    try {
        await transporter.sendMail(mailOptions);
        console.log(`🟢 SUCCESS: OTP delivered successfully to ${email}`);
    } catch (error) {
        console.error("🔴 NODEMAILER ERROR:", error.message);
        throw error;
    }
};

module.exports = { generateOTP, sendOTPEmail };