import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FiMinus, FiPlus } from "react-icons/fi";
import classConcat from "../classConcat";
import HTMLProps from "../HTMLProps";
import FormControlNumber from "./FormControlNumber";
import "./Spinner.css";

type ChangeHandler = (e: Parameters<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>[0]) => void;

export default function Spinner({
    value,
    min,
    max,
    step,
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
    step = step ?? 1;
    return <InputGroup className={classConcat("spinner", className)} style={style}>
        <Button
            size="sm"
            variant="outline-secondary"
            disabled={min !== undefined && value <= min}
            onClick={onChange.bind(null, value - step)}
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
                onChange={onChange}
            />
        }

        <Button
            size="sm"
            variant="outline-secondary"
            disabled={max !== undefined && value >= max}
            onClick={onChange.bind(null, value + step)}
        >
            <FiPlus />
        </Button>
    </InputGroup>;
}
