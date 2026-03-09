import React from "react";
import { useState } from "react";
import { usePizzaBuilder } from "../../context/PizzaBuilderContext";
import { createOrder } from "../../services/orderService";

const ingredientPrices = {
    base: {
        "Thin Crust": 120,
        "Classic Pan": 140,
        "Whole Wheat": 150,
    },
    sauce: {
        "Tomato Basil": 35,
        "Spicy Arrabbiata": 45,
        Pesto: 50,
    },
    cheese: {
        Mozzarella: 60,
        Cheddar: 65,
        "Vegan Cheese": 80,
    },
    veggie: 20,
};

const SummaryStep = () => {
    const { pizzaData } = usePizzaBuilder();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPrice =
        (ingredientPrices.base[pizzaData.base] || 0) +
        (ingredientPrices.sauce[pizzaData.sauce] || 0) +
        (ingredientPrices.cheese[pizzaData.cheese] || 0) +
        pizzaData.veggies.length * ingredientPrices.veggie;

    const handlePayNow = async () => {
        try {
            setIsSubmitting(true);

            // In production, userId should come from authenticated session/JWT.
            const orderPayload = {
                userId: "64f0f9c2a4d3f0b1c2d3e4f5",
                pizzaConfig: pizzaData,
                totalPrice,
                paymentStatus: "Pending",
            };

            const order = await createOrder(orderPayload);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key",
                amount: totalPrice * 100,
                currency: "INR",
                name: "Pizza Delivery",
                description: `Custom Pizza Order ${order._id}`,
                handler: function () {
                    alert("Payment successful. Order placed.");
                },
                prefill: {
                    email: "customer@example.com",
                },
                theme: {
                    color: "#c44536",
                },
            };

            if (window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                alert("Order created. Add Razorpay checkout script to enable payment popup.");
            }
        } catch (error) {
            alert(error.message || "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section>
            <h2>Step 5: Summary</h2>
            <p><strong>Base:</strong> {pizzaData.base}</p>
            <p><strong>Sauce:</strong> {pizzaData.sauce}</p>
            <p><strong>Cheese:</strong> {pizzaData.cheese}</p>
            <p><strong>Veggies:</strong> {pizzaData.veggies.length ? pizzaData.veggies.join(", ") : "None"}</p>
            <p><strong>Total:</strong> INR {totalPrice}</p>
            <button type="button" onClick={handlePayNow} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
        </section>
    );
};

export default SummaryStep;
