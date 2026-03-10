const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, resetUrl) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === "YOUR_16_CHAR_APP_PASSWORD") {
        throw new Error("Email service is not configured. Set EMAIL_USER and EMAIL_PASS with a valid Gmail app password.");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset your Pizza Delivery password",
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 10 minutes.</p>
        `,
    });

    return { delivered: true };
};

module.exports = sendPasswordResetEmail;
