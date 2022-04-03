import {
    Checkbox,
    FormControlLabel,
    MenuItem,
    Radio,
    TextField,
} from "@mui/material";
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
    /**
     * Value is the human readable option
     * Key is what will be sent to the server
     */
    items?: { key: string | number; value: string }[];
    checked?: boolean;
    value?: string | number;
    label: string;
    disabled: boolean;
    error?: FieldError;
    setValueAs?: (v: any) => any;
    type: "input" | "checkbox" | "radio" | "select" | "hidden";
    field?: ControllerRenderProps<FieldValues, string>;
}> = ({
    items,
    type,
    field,
    disabled,
    error,
    label,
    inputType,
    checked,
    value,
}) => {
    let validator: (e: BaseEvent) => BaseEvent;

    if (type !== "radio" && !field) throw new Error("field is required");

    if (type === "checkbox" && checked === undefined)
        throw new Error(`Invalid args type: ${type}, checked: ${checked}`);

    if (type === "select" && !items)
        throw new Error(`Invalid args type: ${type}, items: ${items}`);

    if (type === "radio" && !value)
        throw new Error(`Invalid args type: ${type}, value: ${value}`);

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
                    checked={checked}
                    label={label}
                    control={
                        <Checkbox
                            disabled={disabled}
                            value={field!.value}
                            onChange={field!.onChange}
                            onBlur={field!.onBlur}
                        />
                    }
                />
            );
        case "hidden":
            return <input type="hidden" disabled={true} value={field!.value} />;
        case "input":
            return (
                <TextField
                    value={field!.value}
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
        case "radio":
            return (
                <FormControlLabel
                    value={value}
                    checked={checked}
                    control={<Radio />}
                    label={label}
                />
            );
        case "select":
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
                    {
                        // Check is done above
                    }
                    {items!.map(({ key, value }) => (
                        // FIXME: key is meant only for react purposes
                        // Value is what should be sent
                        // Need to adjust so that the value set is different thant the component value
                        <MenuItem key={key} value={key}>
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
