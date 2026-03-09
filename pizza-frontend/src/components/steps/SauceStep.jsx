import React from "react";
import { pizzaOptions } from "../../data/pizzaOptions";
import { usePizzaBuilder } from "../../context/PizzaBuilderContext";

const SauceStep = () => {
    const { pizzaData, updatePizza } = usePizzaBuilder();

    return (
        <section>
            <h2>Step 2: Choose Sauce</h2>
            {pizzaOptions.sauce.map((sauce) => (
                <label key={sauce} className="option-row">
                    <input
                        type="radio"
                        name="sauce"
                        value={sauce}
                        checked={pizzaData.sauce === sauce}
                        onChange={(event) => updatePizza("sauce", event.target.value)}
                    />
                    <span>{sauce}</span>
                </label>
            ))}
        </section>
    );
};

export default SauceStep;
