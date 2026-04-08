import React from "react";
import { useNavigate } from "react-router-dom";
import PizzaBuilder from "./PizzaBuilder";
import PizzaDashboard from "./PizzaDashboard";
import AdminInventoryManager from "./AdminInventoryManager";
import AdminOrderManager from "./AdminOrderManager";
import AdminUserManager from "./AdminUserManager";
import OvenRushHomeChrome from "./OvenRushHomeChrome";
import { useAuth } from "../context/AuthContext";

const WorkspaceShell = ({ showAdminPanels = false }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="app-shell">
            <OvenRushHomeChrome user={user} onLogout={handleLogout} />
            <PizzaDashboard />
            {showAdminPanels && <AdminOrderManager />}
            {showAdminPanels && <AdminInventoryManager />}
            {showAdminPanels && <AdminUserManager />}
            <PizzaBuilder />
        </div>
    );
};

export default WorkspaceShell;
