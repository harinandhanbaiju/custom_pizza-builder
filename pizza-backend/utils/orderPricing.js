const Inventory = require("../models/Inventory");
const { sendLowStockAlertEmail } = require("../services/emailService");

const findInventoryItem = async (itemType, itemName) => {
    return Inventory.findOne({ itemType, itemName });
};

const getValidatedOrderPricing = async (pizzaConfig) => {
    const { base, sauce, cheese, veggies = [] } = pizzaConfig;

    if (!base || !sauce || !cheese) {
        throw new Error("Base, sauce and cheese are required");
    }

    const baseItem = await findInventoryItem("base", base);
    const sauceItem = await findInventoryItem("sauce", sauce);
    const cheeseItem = await findInventoryItem("cheese", cheese);

    if (!baseItem || !sauceItem || !cheeseItem) {
        throw new Error("One or more selected core ingredients are unavailable");
    }

    const veggieItems = await Inventory.find({
        itemType: "veggie",
        itemName: { $in: veggies },
    });

    if (veggies.length !== veggieItems.length) {
        throw new Error("One or more selected veggies are unavailable");
    }

    const allItems = [baseItem, sauceItem, cheeseItem, ...veggieItems];

    const outOfStockItem = allItems.find((item) => item.quantity < 1);
    if (outOfStockItem) {
        throw new Error(`${outOfStockItem.itemName} is out of stock`);
    }

    const totalPrice = allItems.reduce((sum, item) => sum + item.price, 0);

    return { totalPrice, allItems };
};

const decrementInventoryForOrder = async (items) => {
    for (const item of items) {
        const updatedItem = await Inventory.findOneAndUpdate(
            { _id: item._id, quantity: { $gt: 0 } },
            { $inc: { quantity: -1 } },
            { new: true }
        );

        if (!updatedItem) {
            throw new Error(`${item.itemName} is out of stock`);
        }

        if (updatedItem && updatedItem.quantity < updatedItem.threshold && !updatedItem.alertSent) {
            await Inventory.updateOne(
                { _id: updatedItem._id },
                { $set: { alertSent: true } }
            );
            sendLowStockAlertEmail(updatedItem).catch(console.error);
        }
    }
};

module.exports = {
    getValidatedOrderPricing,
    decrementInventoryForOrder,
};
