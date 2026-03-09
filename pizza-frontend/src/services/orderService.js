const API_BASE_URL = "http://localhost:5000/api";

export const createOrder = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
    }

    return response.json();
};
