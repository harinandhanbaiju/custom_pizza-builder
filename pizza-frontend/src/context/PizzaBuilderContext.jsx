import React from "react";
import { createContext, useContext, useMemo, useState } from "react";

const PizzaBuilderContext = createContext(null);

export const PizzaBuilderProvider = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [pizzaData, setPizzaData] = useState({
        base: "",
        sauce: "",
        cheese: "",
        veggies: [],
    });

    const updatePizza = (key, value) => {
        setPizzaData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const value = useMemo(
        () => ({
            currentStep,
            pizzaData,
            updatePizza,
            nextStep,
            prevStep,
        }),
        [currentStep, pizzaData]
    );

    return <PizzaBuilderContext.Provider value={value}>{children}</PizzaBuilderContext.Provider>;
};

export const usePizzaBuilder = () => {
    const context = useContext(PizzaBuilderContext);

    if (!context) {
        throw new Error("usePizzaBuilder must be used within PizzaBuilderProvider");
    }

    return context;
};
