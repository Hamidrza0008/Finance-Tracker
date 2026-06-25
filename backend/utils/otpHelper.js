const nodemailer = require("nodemailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    // 🟢 FIX: Host, Port aur TLS add kiya taaki Render block na kare
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // Agar 465 pe timeout ho, toh ise 587 aur secure ko false kar dena
        secure: true, 
        pool: true, // Connection pooling se performance behtar hoti hai
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Make sure ye 16-digit App Password ho
        },
        tls: {
            rejectUnauthorized: false // Strict SSL checking ko bypass karne ke liye (Cloud ke liye zaroori)
        }
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

    // 🟢 FIX: Yahan catch block lagaya taaki error seedhe controller tak pahunche
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Nodemailer transport error inside helper:", error);
        throw new Error(error.message); // Controller ko error pass karega
    }
};

module.exports = { generateOTP, sendOTPEmail };