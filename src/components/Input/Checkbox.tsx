import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { BaseProps } from ".";

export interface SingleCheckboxProps extends BaseProps {
    label: string;
    field: ControllerRenderProps<FieldValues, string>;
}

const CheckboxControl: React.FC<SingleCheckboxProps> = ({
    disabled,
    label,
    field,
}) => {
    return (
        <FormControlLabel
            label={label}
            control={
                <Checkbox
                    disabled={disabled}
                    {...field}
                    checked={field.value}
                />
            }
        />
    );
};

export default CheckboxControl;
