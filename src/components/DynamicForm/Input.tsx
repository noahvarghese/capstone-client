import { Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import {
    FieldError,
    ControllerRenderProps,
    FieldValues,
} from "react-hook-form";

type BaseEvent = { target: any; type?: any };

const Input: React.FC<{
    /**
     * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
     * Only used if type is input
     * @default 'text'
     */
    inputType?: string;
    items?: { key: string; value: string }[];
    label: string;
    disabled: boolean;
    error: FieldError;
    setValueAs?: (v: any) => any;
    type: "input" | "checkbox" | "select" | "hidden";
    field: ControllerRenderProps<FieldValues, string>;
}> = ({ items, type, field, disabled, error, label, inputType }) => {
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

    switch (type) {
        case "checkbox":
            return (
                <FormControlLabel
                    checked={Boolean(field.value)}
                    label={label}
                    control={
                        <Checkbox
                            disabled={disabled}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                        />
                    }
                />
            );
        case "hidden":
            return <input type="hidden" disabled={true} value={field.value} />;
        case "input":
            return (
                <TextField
                    value={field.value}
                    onChange={(e) => {
                        const ev = validator !== undefined ? validator(e) : e;
                        return field.onChange(ev);
                    }}
                    onBlur={field.onBlur}
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
        case "select":
            if (!items) throw new Error("Items not provided for select input");

            return (
                <TextField
                    select
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label={label}
                    placeholder={label}
                    error={Boolean(error)}
                    helperText={error?.message}
                    disabled={disabled}
                    required
                >
                    {items.map(({ key, value }) => (
                        <MenuItem key={key} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </TextField>
            );
        default:
            throw new Error(`Invalid type: ${type}`);
    }
};

export default Input;
