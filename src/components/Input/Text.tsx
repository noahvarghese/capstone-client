import { TextField } from "@mui/material";
import React from "react";
import {
    FieldError,
    ControllerRenderProps,
    FieldValues,
} from "react-hook-form";
import { BaseProps } from ".";

type BaseEvent = { target: any; type?: any };

export interface TextInputProps extends BaseProps {
    error?: FieldError;
    field: ControllerRenderProps<FieldValues, string>;
    /**
     * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
     * Only used if type is input
     * @default 'text'
     */
    inputType?: string;
    label: string;
}

const Text: React.FC<TextInputProps> = ({
    field,
    label,
    disabled,
    error,
    inputType,
}) => {
    let validator: (e: BaseEvent) => BaseEvent;

    if (inputType === "number")
        validator = (e: BaseEvent): BaseEvent => ({
            ...e,
            target: {
                ...e.target,
                value:
                    isNaN(Number(e.target.value)) || e.target.value.length === 0
                        ? ""
                        : Number(e.target.value),
            },
        });

    return (
        <TextField
            value={field.value}
            onChange={(e) => {
                const ev = validator !== undefined ? validator(e) : e;
                return field!.onChange(ev);
            }}
            onBlur={field!.onBlur}
            label={label}
            placeholder={label}
            type={inputType ? inputType : "text"}
            style={{ margin: "0.5rem 0" }}
            error={Boolean(error)}
            helperText={error?.message}
            disabled={disabled}
            required
        />
    );
};

export default Text;
