import React from "react";
import { pizzaOptions } from "../../data/pizzaOptions";
import { usePizzaBuilder } from "../../context/PizzaBuilderContext";

const BaseStep = () => {
    const { pizzaData, updatePizza } = usePizzaBuilder();

    return (
        <section>
            <h2>Step 1: Choose Base</h2>
            {pizzaOptions.base.map((base) => (
                <label key={base} className="option-row">
                    <input
                        type="radio"
                        name="base"
                        value={base}
                        checked={pizzaData.base === base}
                        onChange={(event) => updatePizza("base", event.target.value)}
                    />
                    <span>{base}</span>
                </label>
            ))}
        </section>
    );
};

export default BaseStep;
