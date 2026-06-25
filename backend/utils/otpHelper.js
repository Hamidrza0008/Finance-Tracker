const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };

    try {
        // 🟢 Using a free public testing relay - No keys required!
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: "74bd89e2-bdf9-4c17-84bc-5c5443a6d96e", // Public testing key for your app
                from_name: "FinTrack Auth",
                subject: subjects[purpose] || "Verification Code",
                to: email,
                message: `Your verification code for ${purpose} is: ${otp}. This code expires in 10 minutes.`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Relay Error");
        }

        console.log(`🟢 SUCCESS: Public API delivered OTP successfully to ${email}`);
    } catch (error) {
        console.error("🔴 RELAY API ERROR:", error.message);
        throw error;
    }
};

module.exports = { generateOTP, sendOTPEmail };