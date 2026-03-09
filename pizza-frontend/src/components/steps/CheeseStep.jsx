import React from "react";
import { pizzaOptions } from "../../data/pizzaOptions";
import { usePizzaBuilder } from "../../context/PizzaBuilderContext";

const CheeseStep = () => {
    const { pizzaData, updatePizza } = usePizzaBuilder();

    return (
        <section>
            <h2>Step 3: Choose Cheese</h2>
            {pizzaOptions.cheese.map((cheese) => (
                <label key={cheese} className="option-row">
                    <input
                        type="radio"
                        name="cheese"
                        value={cheese}
                        checked={pizzaData.cheese === cheese}
                        onChange={(event) => updatePizza("cheese", event.target.value)}
                    />
                    <span>{cheese}</span>
                </label>
            ))}
        </section>
    );
};

export default CheeseStep;
