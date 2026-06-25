const { Resend } = require("resend");

// Render ke environment variable se Resend initialize ho raha hai
const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };

    try {
        // 🟢 Resend ka API Call jise Render ka network kabhi block nahi kar sakta
        await resend.emails.send({
            from: "onboarding@resend.dev", // Free tier me yahi automatic milti hai
            to: email, // Jis user ne signup kiya uski email
            subject: subjects[purpose] || "Verification Code",
            html: `
                <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                    <h2>Security Verification</h2>
                    <p>Your verification code for <strong>${purpose}</strong> is:</p>
                    <h1 style="background: #f4f4f5; padding: 10px; text-align: center; letter-spacing: 4px; color: #2563eb;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                </div>
            `
        });
        console.log(`🟢 SUCCESS: Resend se OTP chalda gaya to ${email}`);
    } catch (error) {
        console.error("🔴 RESEND API ERROR:", error.message);
        throw error;
    }
};

module.exports = { generateOTP, sendOTPEmail };