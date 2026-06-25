const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };

    try {
        // 🟢 Pure HTTP API Call using Render Environment Variables
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.EMAIL_PASS, // 👈 Render Dashboard se API Key uthayega
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { 
                    name: "FinTrack Auth", 
                    email: process.env.EMAIL_USER // 👈 Render Dashboard se Brevo registered email uthayega
                },
                to: [{ email: email }],
                subject: subjects[purpose] || "Verification Code",
                htmlContent: `
                    <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                        <h2>Security Verification</h2>
                        <p>Your verification code for <strong>${purpose}</strong> is:</p>
                        <h1 style="background: #f4f4f5; padding: 10px; text-align: center; letter-spacing: 4px; color: #2563eb;">${otp}</h1>
                        <p>This code expires in 10 minutes.</p>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Brevo API Error");
        }

        console.log(`🟢 SUCCESS: OTP delivered successfully to ${email}`);
    } catch (error) {
        console.error("🔴 BREVO API ERROR:", error.message);
        throw error;
    }
};

module.exports = { generateOTP, sendOTPEmail };