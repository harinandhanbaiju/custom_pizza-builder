import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getInventory } from "../services/inventoryService";
import { getMyOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const PizzaDashboard = () => {
    const { user, token } = useAuth();
    const [inventory, setInventory] = useState({ base: [], sauce: [], cheese: [], veggie: [], meat: [] });
    const [myOrders, setMyOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadDashboard = useCallback(async ({ silent = false } = {}) => {
        try {
            const [inventoryData, myOrdersData] = await Promise.all([
                getInventory(),
                token ? getMyOrders(token) : Promise.resolve({ orders: [] }),
            ]);

            setInventory({
                base: inventoryData.base || [],
                sauce: inventoryData.sauce || [],
                cheese: inventoryData.cheese || [],
                veggie: inventoryData.veggie || [],
                meat: inventoryData.meat || [],
            });
            setMyOrders(myOrdersData.orders || []);
            setLastUpdated(new Date());
        } catch (error) {
            if (!silent) {
                alert(error.message || "Failed to load pizza varieties");
            }
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadDashboard();

        // Keep admin stock view up to date when orders are placed.
        const intervalId = setInterval(() => {
            loadDashboard({ silent: true });
        }, 10000);

        return () => clearInterval(intervalId);
    }, [loadDashboard]);

    const lowStockItems = useMemo(() => {
        return [
            ...inventory.base,
            ...inventory.sauce,
            ...inventory.cheese,
            ...inventory.veggie,
            ...inventory.meat,
        ].filter((item) => Number(item.stockQuantity) <= Number(item.thresholdValue));
    }, [inventory]);

    const showAdminStock = user?.role === "admin";
    const availableVarietiesCount = inventory.base.length * inventory.sauce.length;
    const inventorySections = [
        { key: "base", title: "Bases", items: inventory.base },
        { key: "sauce", title: "Sauces", items: inventory.sauce },
        { key: "cheese", title: "Cheese", items: inventory.cheese },
        { key: "veggie", title: "Veggies", items: inventory.veggie },
        { key: "meat", title: "Meat", items: inventory.meat },
    ];

    if (isLoading) {
        return (
            <section className="dashboard-shell bt-dashboard">
                <header className="bt-dash-header">
                    <p className="bt-dash-kicker">Kitchen Index</p>
                    <h2>Dashboard</h2>
                    <p className="bt-dash-subhead">Loading ingredient matrix...</p>
                </header>
            </section>
        );
    }

    return (
        <section className="dashboard-shell bt-dashboard">
            <header className="bt-dash-header">
                <p className="bt-dash-kicker">Kitchen Index</p>
                <h2>Pizza Dashboard</h2>
                <p className="bt-dash-subhead">
                    Ingredient intelligence and live order pulse
                    {lastUpdated ? ` . Updated ${lastUpdated.toLocaleTimeString()}` : ""}
                </p>
            </header>

            <section className="bt-dash-metrics" aria-label="Dashboard metrics">
                <article className="bt-dash-metric">
                    <span className="bt-dash-metric-label">Base x Sauce</span>
                    <strong>{availableVarietiesCount}</strong>
                </article>
                <article className="bt-dash-metric">
                    <span className="bt-dash-metric-label">My Orders</span>
                    <strong>{myOrders.length}</strong>
                </article>
                <article className="bt-dash-metric">
                    <span className="bt-dash-metric-label">Low Stock</span>
                    <strong>{showAdminStock ? lowStockItems.length : "-"}</strong>
                </article>
                <article className="bt-dash-metric">
                    <span className="bt-dash-metric-label">Ingredients</span>
                    <strong>{inventory.base.length + inventory.sauce.length + inventory.cheese.length + inventory.veggie.length + inventory.meat.length}</strong>
                </article>
            </section>

            <article className="dashboard-card dashboard-flow-card bt-dash-cta">
                <h3>Build Next Pizza</h3>
                <p>
                    Pick from <strong>{inventory.base.length}</strong> base options and <strong>{inventory.sauce.length}</strong> sauces,
                    then finalize cheese and veggie layers.
                </p>
                <a className="dashboard-start-link" href="#pizza-builder">Start Customizing</a>
            </article>

            <div className="dashboard-grid bt-dash-grid">
                {inventorySections.map((section) => (
                    <article className="dashboard-card bt-dash-panel" key={section.key}>
                        <h3>{section.title}</h3>
                        <ul className="bt-dash-list">
                            {section.items.map((item) => (
                                <li key={item._id}>
                                    <span>{item.name}</span>
                                    {showAdminStock && <span className="bt-dash-stock">Stock {item.stockQuantity}</span>}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>

            <article className="dashboard-card user-orders-card bt-dash-orders">
                <h3>My Orders</h3>
                {!myOrders.length && <p>No orders yet. Place your first custom pizza.</p>}
                {myOrders.length > 0 && (
                    <ul className="user-orders-list">
                        {myOrders.map((order) => (
                            <li key={order._id}>
                                <strong className="bt-order-id">#{order._id.slice(-8)}</strong>
                                <span>{order.pizzaConfig?.base} / {order.pizzaConfig?.sauce} / {order.pizzaConfig?.cheese}</span>
                                <span>Status: <b>{order.status || "Order Received"}</b></span>
                                <span>Payment: {order.paymentStatus || "Pending"}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </article>
        </section>
    );
};

export default PizzaDashboard;
