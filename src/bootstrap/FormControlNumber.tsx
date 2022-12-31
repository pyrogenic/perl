import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FiMinus, FiPlus } from "react-icons/fi";
import classConcat from "../classConcat";
import HTMLProps from "../HTMLProps";

type ChangeHandler = (e: Parameters<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>[0]) => void;

function clamp(v: number, min: number | undefined, max: number | undefined) {
    if (min !== undefined && v < min) {
        return min;
    } 
    if (max !== undefined && v > max) {
        return max;
    }
    return v;
}

export default function FormControlNumber({
    value,
    min,
    max,
    step: stepIn,
    title,
    className,
    style,
    onChange,
}: {
    value: number,
    min?: number,
    max?: number,
    step?: number,
    title?: string,
    onChange: (value: number) => void,
} & HTMLProps) {
    const step = stepIn ?? 1;
    const [floatingValue, setFloatingValue] = React.useState<string>(value.toString());
    const onChangeFloatingValue = React.useCallback<ChangeHandler>((e) => {
        setFloatingValue(e.target.value);
    }, [setFloatingValue]);
    const onChangeInput = React.useCallback<ChangeHandler>((e) => {
        const v = Number(e.target.value);
        onChange(v);
    }, [setFloatingValue]);
    const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>>((e) => {
        const n = Number(floatingValue);
        if (n.toString() !== floatingValue)
        {
            return;
        }
        if (e.key === "Enter") {
            onChange(clamp(n, min, max));
        } else if (e.key === "ArrowDown") {
            onChange(clamp(n - step, min, max));
        } else if (e.key === "ArrowUp") {
            onChange(clamp(n + step, min, max));
        }
    }, [onChange, step]);
    React.useEffect(() => setFloatingValue(value.toString()), [value, setFloatingValue]);
    const newLocal = "3rem";
    return <Form.Control
                className={classConcat(className)}
                title={title}
                onChange={onChangeFloatingValue}
                onKeyDown={onKeyDown}
                onBlur={onChangeInput}
                value={floatingValue}
                style={{width: newLocal}}
            />;
}
