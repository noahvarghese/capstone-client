import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { Noop } from "react-hook-form";
import { BaseProps } from ".";

export interface SingleCheckboxProps extends BaseProps {
    label: string;
    name: string;
    onChange?: (...event: any[]) => void;
    onBlur?: Noop;
    value: string | number;
}

const CheckboxControl: React.FC<SingleCheckboxProps> = ({
    disabled,
    label,
    name,
    onBlur,
    onChange,
    value,
}) => {
    return (
        <FormControlLabel
            label={label}
            control={
                <Checkbox
                    disabled={disabled}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            }
        />
    );
};

export default CheckboxControl;
