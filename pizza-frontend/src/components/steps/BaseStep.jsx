import React from "react";
import { usePizzaBuilder } from "../../context/PizzaBuilderContext";

const BaseStep = () => {
    const { pizzaData, updatePizza, options, isOptionsLoading } = usePizzaBuilder();

    if (isOptionsLoading) {
        return <section><h2>Step 1: Choose Base</h2><p>Loading options...</p></section>;
    }

    return (
        <section>
            <h2>Step 1: Choose Base</h2>
            {options.base.map((baseItem) => (
                <label key={baseItem.name} className="option-row">
                    <input
                        type="radio"
                        name="base"
                        value={baseItem.name}
                        checked={pizzaData.base === baseItem.name}
                        onChange={(event) => updatePizza("base", event.target.value)}
                    />
                    <span className="option-copy">
                        <strong>{baseItem.name}</strong>
                        <small>Perfect crust balance for your toppings</small>
                    </span>
                    {Number(baseItem.price) > 0 && <span className="option-price">+ INR {baseItem.price}</span>}
                </label>
            ))}
        </section>
    );
};

export default BaseStep;
