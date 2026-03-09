import React from "react";
import { pizzaOptions } from "../../data/pizzaOptions";
import { usePizzaBuilder } from "../../context/PizzaBuilderContext";

const VeggieStep = () => {
    const { pizzaData, updatePizza } = usePizzaBuilder();

    const toggleVeggie = (veggie) => {
        const exists = pizzaData.veggies.includes(veggie);
        const updatedVeggies = exists
            ? pizzaData.veggies.filter((item) => item !== veggie)
            : [...pizzaData.veggies, veggie];

        updatePizza("veggies", updatedVeggies);
    };

    return (
        <section>
            <h2>Step 4: Choose Veggies</h2>
            {pizzaOptions.veggies.map((veggie) => (
                <label key={veggie} className="option-row">
                    <input
                        type="checkbox"
                        value={veggie}
                        checked={pizzaData.veggies.includes(veggie)}
                        onChange={() => toggleVeggie(veggie)}
                    />
                    <span>{veggie}</span>
                </label>
            ))}
        </section>
    );
};

export default VeggieStep;
