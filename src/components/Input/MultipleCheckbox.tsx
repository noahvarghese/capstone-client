import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { BaseProps } from ".";

// TODO: Override name and onChange
// https://stackoverflow.com/questions/61475234/material-ui-react-form-hook-multiple-checkboxes-default-selected
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
}) => {
    return (
        <>
            {items.map(({ id, key, label }) => (
                <FormControlLabel
                    key={key}
                    label={label}
                    onChange={() => {
                        const currentValue = Array.isArray(field.value)
                            ? field.value
                            : [];

                        if (currentValue.includes(id)) {
                            currentValue.splice(currentValue.indexOf(id), 1);
                        } else {
                            currentValue.push(id);
                        }

                        field.onChange(currentValue);
                    }}
                    control={<Checkbox disabled={disabled} />}
                />
            ))}
        </>
    );
};

export default MultipleCheckbox;
