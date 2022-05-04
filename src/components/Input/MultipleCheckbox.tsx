import { FormGroup } from "@mui/material";
import React from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { BaseProps } from ".";
import CheckboxControl from "./Checkbox";

export interface MultipleCheckboxProps extends BaseProps {
    "aria-labelledby": string;
    field: ControllerRenderProps<FieldValues, string>;
    /**
     * key is what is set as the react key when rendering arrays of elements
     * Value is the human readable option
     * id is what will be sent to the server
     */
    items: { id: string | number; key: string; label: string; value: string }[];
}

const MultipleCheckbox: React.FC<MultipleCheckboxProps> = ({
    disabled,
    field,
    items,
    ...rest
}) => {
    return (
        <FormGroup {...field} aria-labelledby={rest["aria-labelledby"]}>
            {items.map(({ id, key, label, value }, index) => (
                <CheckboxControl
                    /**
                     * TODO: Decide how to use names
                     */
                    name=""
                    disabled={disabled}
                    key={key}
                    label={key}
                    value={value}
                />
            ))}
        </FormGroup>
    );
};

export default MultipleCheckbox;
