import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getInventory } from "../services/inventoryService";
import { useAuth } from "../context/AuthContext";

const PizzaDashboard = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState({ base: [], sauce: [], cheese: [], veggie: [], meat: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadDashboard = useCallback(async ({ silent = false } = {}) => {
        try {
            const data = await getInventory();
            setInventory({
                base: data.base || [],
                sauce: data.sauce || [],
                cheese: data.cheese || [],
                veggie: data.veggie || [],
                meat: data.meat || [],
            });
            setLastUpdated(new Date());
        } catch (error) {
            if (!silent) {
                alert(error.message || "Failed to load pizza varieties");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

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

    if (isLoading) {
        return (
            <section className="dashboard-shell">
                <h2>Pizza Dashboard</h2>
                <p>Loading varieties...</p>
            </section>
        );
    }

    return (
        <section className="dashboard-shell">
            <h2>Pizza Dashboard</h2>
            <p>
                Available pizza ingredient varieties
                {lastUpdated ? ` (Last updated: ${lastUpdated.toLocaleTimeString()})` : ""}
            </p>
            {showAdminStock && (
                <p>
                    Low stock items: <strong>{lowStockItems.length}</strong>
                </p>
            )}
            <div className="dashboard-grid">
                <article className="dashboard-card">
                    <h3>Bases</h3>
                    <ul>
                        {inventory.base.map((item) => (
                            <li key={item._id}>
                                {item.name}
                                {showAdminStock ? ` - Stock ${item.stockQuantity}` : ""}
                            </li>
                        ))}
                    </ul>
                </article>
                <article className="dashboard-card">
                    <h3>Sauces</h3>
                    <ul>
                        {inventory.sauce.map((item) => (
                            <li key={item._id}>
                                {item.name}
                                {showAdminStock ? ` - Stock ${item.stockQuantity}` : ""}
                            </li>
                        ))}
                    </ul>
                </article>
                <article className="dashboard-card">
                    <h3>Cheese</h3>
                    <ul>
                        {inventory.cheese.map((item) => (
                            <li key={item._id}>
                                {item.name}
                                {showAdminStock ? ` - Stock ${item.stockQuantity}` : ""}
                            </li>
                        ))}
                    </ul>
                </article>
                <article className="dashboard-card">
                    <h3>Veggies</h3>
                    <ul>
                        {inventory.veggie.map((item) => (
                            <li key={item._id}>
                                {item.name}
                                {showAdminStock ? ` - Stock ${item.stockQuantity}` : ""}
                            </li>
                        ))}
                    </ul>
                </article>
                <article className="dashboard-card">
                    <h3>Meat</h3>
                    <ul>
                        {inventory.meat.map((item) => (
                            <li key={item._id}>
                                {item.name}
                                {showAdminStock ? ` - Stock ${item.stockQuantity}` : ""}
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    );
};

export default PizzaDashboard;
