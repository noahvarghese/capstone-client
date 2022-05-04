import { MenuItem, TextField } from "@mui/material";
import React from "react";
import {
    FieldError,
    ControllerRenderProps,
    FieldValues,
} from "react-hook-form";
import { BaseProps } from ".";

export interface SelectProps extends BaseProps {
    error?: FieldError;
    field: ControllerRenderProps<FieldValues, string>;
    label: string;
    /**
     * key is what is set as the react key when rendering arrays of elements
     * Value is the human readable option
     * id is what will be sent to the server
     */
    items: { id: string | number; key: string; label: string; value: string }[];
}

const Select: React.FC<SelectProps> = ({
    disabled,
    error,
    field,
    items,
    label,
}) => {
    return (
        <TextField
            select
            value={field!.value}
            onChange={field!.onChange}
            onBlur={field!.onBlur}
            label={label}
            placeholder={label}
            error={Boolean(error)}
            helperText={error?.message}
            disabled={disabled}
            required
        >
            {items.map(({ key, value }) => (
                // FIXME: key is meant only for react purposes
                // Value is what should be sent
                // Need to adjust so that the value set is different thant the component value
                <MenuItem key={key} value={key}>
                    {value}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default Select;
