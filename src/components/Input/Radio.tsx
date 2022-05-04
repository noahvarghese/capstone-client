import React from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { BaseProps } from ".";

export interface RadioGroupProps extends BaseProps {
    "aria-labelledby": string;
    field: ControllerRenderProps<FieldValues, string>;
    /**
     * key is what is set as the react key when rendering arrays of elements
     * Value is the human readable option
     * id is what will be sent to the server
     */
    items: { id: string | number; key: string; label: string; value: string }[];
}

const RadioControl: React.FC<RadioGroupProps> = ({
    disabled,
    field,
    items,
    ...rest
}) => {
    return (
        <RadioGroup
            /* Make sure field.value !== undefined and then assign */
            {...{ ...field, value: field.value ?? "" }}
            /** Cannot destructure a variable with a hyphen */
            aria-labelledby={rest["aria-labelledby"]}
            defaultValue=""
        >
            {items.map(({ key, label, value }) => (
                <FormControlLabel
                    key={key}
                    value={value}
                    control={<Radio disabled={disabled} />}
                    label={label}
                />
            ))}
        </RadioGroup>
    );
};

export default RadioControl;
