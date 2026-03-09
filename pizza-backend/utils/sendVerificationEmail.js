const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationLink = `http://localhost:5000/api/users/verify/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `
            <h2>Welcome to Pizza Delivery</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">${verificationLink}</a>
        `,
    });
};

module.exports = sendVerificationEmail;
