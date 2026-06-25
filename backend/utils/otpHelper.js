const nodemailer = require("nodemailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose) => {
    const transporter = nodemailer.createTransport({
        // 🟢 'service' mat likhna, direct host name dalo
        host: "smtp.gmail.com",
        port: 465, // Secure SSL port
        secure: true, // 465 ke sath hamesha true rahega
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // 🔴 CRITICAL FIX FOR RENDER: Ise dhyan se lagao
        family: 4, // 👈 Yeh Nodemailer ko strictly bolta hai ki sirf IPv4 use kare (IPv6 ka ENETUNREACH error khatam)
        connectionTimeout: 15000, // Timeout badha diya taaki server thoda intezar kare
        socketTimeout: 15000,
        tls: {
            rejectUnauthorized: false // Cloud networks pe authentication handshake ko pass karwane ke liye
        }
    });

    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };

    const mailOptions = {
        from: `"FinTrack Auth" <${process.env.EMAIL_USER}>`,
        to: email, // Ab kisi bhi email par bhej kar check karo
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
        console.log(`🟢 SUCCESS: Gmail sent OTP successfully to ${email}`);
    } catch (error) {
        console.error("🔴 NODEMAILER GMAIL ERROR:", error.message);
        throw error;
    }
};

module.exports = { generateOTP, sendOTPEmail };