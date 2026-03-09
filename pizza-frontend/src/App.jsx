import React from "react";
import PizzaBuilder from "./components/PizzaBuilder";
import { PizzaBuilderProvider } from "./context/PizzaBuilderContext";

const App = () => {
    return (
        <PizzaBuilderProvider>
            <PizzaBuilder />
        </PizzaBuilderProvider>
    );
};

export default App;
