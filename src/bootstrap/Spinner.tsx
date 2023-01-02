import React from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FiMinus, FiPlus } from "react-icons/fi";
import classConcat from "../classConcat";
import HTMLProps from "../HTMLProps";
import FormControlNumber from "./FormControlNumber";
import "./Spinner.css";

/** 
 * An attractive replacement for the regular form input field for an integer with more obvious "+" and "-" buttons.
 * 
 * ![screenshot](https://user-images.githubusercontent.com/4270301/210191174-ee1db4a0-213b-424b-a416-22194fff699a.png)
 *
 * Uses {@link FormControlNumber} to avoid calling {@link onChange} with "0".
 */
export default function Spinner({
    value,
    min,
    max,
    step: stepIn,
    title,
    className,
    style,
    onChange,
    onClick,
}: {
    value: number,
    min?: number,
    max?: number,
    step?: number,
    title?: string,
    onChange: (value: number) => void,
    onClick?: () => void,
} & HTMLProps) {
    const step = stepIn ?? 1;
    const onClickMinus = React.useCallback(() => onChange(value - step), [onChange, value, step]);
    const onClickPlus = React.useCallback(() => onChange(value + step), [onChange, value, step]);
    return <InputGroup className={classConcat("spinner", className)} style={style}>
        <Button
            size="sm"
            variant="outline-secondary"
            disabled={min !== undefined && value <= min}
            onClick={onClickMinus}
        >
            <FiMinus />
        </Button>

        {onClick
            ?
            <InputGroup.Text
                className="count"
                title={title}
                onClick={onClick}
            >
                {value}
            </InputGroup.Text>
            :
            <FormControlNumber
                className="count"
                title={title}
                value={value}
                min={min}
                max={max}
                step={step}
                arrowStep
                onChange={onChange}
            />
        }

        <Button
            size="sm"
            variant="outline-secondary"
            disabled={max !== undefined && value >= max}
            onClick={onClickPlus}
        >
            <FiPlus />
        </Button>
    </InputGroup>;
}
