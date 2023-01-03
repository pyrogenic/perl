import React from "react";
import Form from "react-bootstrap/Form";
import classConcat from "../classConcat";
import HTMLProps from "../HTMLProps";
import { FormControlChangeHandler } from "../CommonTypes";

function clamp(v: number, min: number | undefined, max: number | undefined) {
    if (min !== undefined && v < min) {
        return min;
    }
    if (max !== undefined && v > max) {
        return max;
    }
    return v;
}

type FormControlNumberProps = {
    value: number,
    min?: number,
    max?: number,
    step?: number,
    title?: string,
    /** if true, use a text field and handle steps in code rather than relying on the browser's number field behavior */
    arrowStep?: boolean,
    /** If undefined, regular floating point. If zero, an integer. If >0, fixed. */
    places?: number,
    onChange: (value: number) => void,
} & HTMLProps;

/**
 * Renders an &lt;input> field but doesn't invoke {@link onChange} unless the {@link value} is a valid number.
 * This avoids the nonsense where typing a letter, or clearing the field, becomes a "0".
 * 
 * Common options:
 *  - Use {@link arrowStep} to reclaim the screen real estate taken by browser's spinners while retaining arrow-stepping.
 *  - Use {@link places} to display a number with a fixed number of places, e.g. "2" is good for dollars-and-cents.
 */
export default function FormControlNumber({
    value,
    min,
    max,
    step: stepIn,
    title,
    className,
    style,
    arrowStep,
    places,
    onChange,
}: FormControlNumberProps) {
    const step = stepIn ?? 1;
    const spinning = React.useRef<boolean>(false);
    const [floatingValue, setFloatingValue] = React.useState<string>(value.toString());
    const format = React.useCallback((v: number) => {
        if (places === undefined) {
            return v.toString();
        } else {
            return v.toFixed(places);
        }
    }, [places]);
    const onChangeFloatingValue = React.useCallback<FormControlChangeHandler>((e) => {
        let newFloatingValue = e.target.value;
        if (spinning.current) {
            newFloatingValue = format(Number(newFloatingValue));
        }
        setFloatingValue(newFloatingValue);
    }, [setFloatingValue]);
    const onChangeInput = React.useCallback<FormControlChangeHandler>((e) => {
        const v = Number(e.target.value);
        onChange(clamp(v, min, max));
    }, [setFloatingValue]);
    const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>>((e) => {
        const n = Number(floatingValue);
        const formattedN = format(n);
        //console.log({floatingValue, n, formattedN, value: e.target.value});
        if (n.toString() !== floatingValue) {
            return;
        }
        spinning.current = false;
        if (e.key === "Enter") {
            onChange(clamp(n, min, max));
            return;
        } 
        if (e.key === "ArrowDown") {
            if (arrowStep) {
                onChange(clamp(n - step, min, max));
            } else {
                spinning.current = true;
            }
        } else if (e.key === "ArrowUp") {
            if (arrowStep) {
                onChange(clamp(n + step, min, max));
            } else {
                spinning.current = true;       
            }
        }
    }, [onChange, floatingValue, spinning, step]);
    React.useEffect(() => setFloatingValue(format(value)), [value, format, setFloatingValue]);
    const width = React.useMemo(() => `${1 + (max ?? 100).toString().length * 0.6}rem`, [max]);
    const compositeStyle = React.useMemo<React.CSSProperties>(() => ({width, ...style}), [width, style]);
    return <Form.Control
        type={arrowStep ? undefined : "number"}
        min={min}
        max={max}
        step={step}
        className={classConcat(className)}
        title={title}
        onChange={onChangeFloatingValue}
        onKeyDown={onKeyDown}
        onBlur={onChangeInput}
        value={floatingValue}
        style={compositeStyle}
    />;
}
