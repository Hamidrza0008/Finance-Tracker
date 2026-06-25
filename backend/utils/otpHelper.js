const brevo = require("@getbrevo/brevo");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const sendOTPEmail = async (email, otp, purpose) => {

    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );


    const subjects = {
        "signup": "Verify Your Account - OTP",
        "reset-password": "Reset Your Password - OTP"
    };


    const mail = new brevo.SendSmtpEmail();

    mail.sender = {
        name: "FinTrack Auth",
        email: process.env.EMAIL_FROM
    };


    mail.to = [
        {
            email: email
        }
    ];


    mail.subject = subjects[purpose] || "Verification Code";


    mail.htmlContent = `
        <div style="font-family:sans-serif;padding:20px;">
            <h2>Security Verification</h2>
            <p>Your OTP for ${purpose} is:</p>

            <h1 style="
            background:#f4f4f5;
            padding:10px;
            text-align:center;
            letter-spacing:4px;
            color:#2563eb;">
                ${otp}
            </h1>

            <p>This code expires in 10 minutes.</p>
        </div>
    `;


    await apiInstance.sendTransacEmail(mail);

    console.log("OTP sent successfully");
};


module.exports = {
    generateOTP,
    sendOTPEmail
};