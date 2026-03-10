import React from "react";
import PizzaBuilder from "./components/PizzaBuilder";
import { PizzaBuilderProvider } from "./context/PizzaBuilderContext";
import { AuthProvider } from "./context/AuthContext";
import AuthPanel from "./components/AuthPanel";
import PizzaDashboard from "./components/PizzaDashboard";
import { useAuth } from "./context/AuthContext";
import AdminInventoryManager from "./components/AdminInventoryManager";
import OvenRushHomeChrome from "./components/OvenRushHomeChrome";

const AuthenticatedArea = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <>
            <PizzaDashboard />
            {user?.role === "admin" && <AdminInventoryManager />}
            <PizzaBuilder />
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <PizzaBuilderProvider>
                <div className="app-shell">
                    <OvenRushHomeChrome />
                    <AuthPanel />
                    <AuthenticatedArea />
                </div>
            </PizzaBuilderProvider>
        </AuthProvider>
    );
};

export default App;
