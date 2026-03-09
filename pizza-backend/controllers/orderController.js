const mongoose = require("mongoose");
const Order = require("../models/Order");

// @desc    Create a custom pizza order
// @route   POST /api/orders
// @access  Public (replace with auth middleware later)
const createOrder = async (req, res) => {
    try {
        const { userId, pizzaConfig, totalPrice, paymentStatus } = req.body;

        if (!userId || !pizzaConfig || typeof totalPrice !== "number") {
            return res.status(400).json({ message: "userId, pizzaConfig and totalPrice are required" });
        }

        const { base, sauce, cheese, veggies = [] } = pizzaConfig;

        if (!base || !sauce || !cheese) {
            return res.status(400).json({ message: "Base, sauce and cheese are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const order = await Order.create({
            userId,
            pizzaConfig: {
                base,
                sauce,
                cheese,
                veggies,
            },
            totalPrice,
            paymentStatus: paymentStatus || "Pending",
        });

        return res.status(201).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
};
