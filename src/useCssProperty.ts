import React from "react";

function useCssProperty<TValue extends string | number | boolean>(prop: string) {
    function getValue(): TValue {
        return getComputedStyle(document.documentElement).getPropertyValue(prop) as TValue;
    }
    function changeValue(newValue: TValue) {
        document.documentElement.style.setProperty(prop, newValue ? newValue.toString() : null);
    }
    const state = React.useState(getValue);
    const [value,] = state;
    React.useEffect(() => changeValue(value), [value]);
    return state;
}

export default useCssProperty;
