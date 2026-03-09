const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            verificationToken,
        });

        if (user) {
            await sendVerificationEmail(user.email, verificationToken);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
                token: generateToken(user._id),
                message: "Registration successful. Please verify your email.",
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify user email
// @route   GET /api/users/verify/:token
// @access  Public
const verifyUserEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyUserEmail,
};
