import { Paper, Typography, Box, Button } from "@mui/material";
import {
    Dispatch,
    SetStateAction,
    ReactElement,
    useMemo,
    useCallback,
} from "react";
import { useForm, RegisterOptions, Controller } from "react-hook-form";
import Input, { InputProps } from "../Input";
import { HiddenProps } from "../Input/Hidden";
import { TextInputProps } from "../Input/Text";
import { SelectProps } from "../Input/Select";
import { SingleCheckboxProps } from "../Input/Checkbox";
import { MultipleCheckboxProps } from "../Input/MultipleCheckbox";
import { RadioGroupProps } from "../Input/Radio";

const formInputOptions = [
    "hidden",
    "input",
    "multipleCheckbox",
    "radio",
    "select",
    "singleCheckbox",
] as const;

export declare type FormInputOptions = {
    hidden?: HiddenProps;
    input?: Omit<TextInputProps, "field">;
    multipleCheckbox?: Omit<MultipleCheckboxProps, "field">;
    radio?: Omit<RadioGroupProps, "field">;
    select?: Omit<SelectProps, "field">;
    singleCheckbox?: Omit<SingleCheckboxProps, "field">;
};

export interface FormOptions {
    [x: string]: {
        defaultValue: any;
        registerOptions: RegisterOptions;
    } & FormInputOptions;
}

interface DynamicFormProps {
    disableSubmit?: boolean;
    fetchOptions: RequestInit;
    formOptions: FormOptions;
    /**
     * @default Cancel
     */
    resetButtonText?: string;
    resetOnSubmit?: boolean;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
    /**
     * Dependent on the method provided in fetchOptions POST = 'Create', PUT | PATCH = 'Update'
     * @default Create|Update
     */
    submitButtonText?: string;
    title: string;
    /**
     * Material UI specific
     * @default h6
     */
    titleVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    triggerRefresh?: () => void;
    url: string;
}

const DynamicForm = ({
    disableSubmit,
    fetchOptions,
    formOptions,
    resetButtonText = "Cancel",
    resetOnSubmit,
    setAlert,
    submitButtonText,
    title,
    titleVariant,
    triggerRefresh,
    url,
}: DynamicFormProps): ReactElement => {
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
    } = useForm({
        mode: "all",
    });

    const formInputs = useMemo(
        () =>
            Object.entries(formOptions).map(
                ([
                    key,
                    {
                        registerOptions: { disabled, ...rules },
                        defaultValue,
                        ...rest
                    },
                ]) => {
                    return (
                        <Controller
                            key={key}
                            name={key}
                            control={control}
                            defaultValue={defaultValue}
                            rules={rules}
                            render={({ field }) => {
                                let props: Record<string, unknown> = {};

                                for (let [inputType, value] of Object.entries(
                                    rest
                                )) {
                                    if (
                                        value !== undefined &&
                                        formInputOptions.includes(
                                            inputType as typeof formInputOptions[number]
                                        )
                                    ) {
                                        props[inputType] = {
                                            ...value,
                                            field,
                                            label:
                                                (value as TextInputProps)
                                                    .label ?? "",
                                            error: errors[key],
                                            disabled:
                                                (disableSubmit !== undefined &&
                                                    disableSubmit) ||
                                                disabled ||
                                                isSubmitting,
                                        };
                                    }
                                }

                                return <Input {...(props as InputProps)} />;
                            }}
                        />
                    );
                }
            ),
        [control, disableSubmit, errors, formOptions, isSubmitting]
    );

    const submit = useCallback(
        async (d) => {
            const data: Record<string, unknown> = {};

            const entries = Object.entries(d);

            for (const [key, value] of entries) {
                const { valueAsDate, valueAsNumber, setValueAs } =
                    formOptions[key].registerOptions;

                if (valueAsNumber) {
                    data[key] = Number(value);
                } else if (valueAsDate) {
                    data[key] = value;
                } else if (setValueAs) {
                    data[key] = setValueAs(value);
                } else {
                    data[key] = value;
                }
            }

            await fetch(url, {
                ...fetchOptions,
                body: JSON.stringify(data),
            })
                .then((res) => {
                    if (res.ok) {
                        setAlert({
                            message: "Success",
                            severity: "success",
                        });
                        if (triggerRefresh) triggerRefresh();
                        if (resetOnSubmit) reset();
                        return;
                    } else {
                        reset();
                        setAlert({ message: "Error", severity: "error" });
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                });
        },
        [
            fetchOptions,
            formOptions,
            reset,
            resetOnSubmit,
            setAlert,
            triggerRefresh,
            url,
        ]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography
                variant={titleVariant ?? "h6"}
                variantMapping={{ h6: "h4", h5: "h3", h4: "h2" }}
            >
                {title}
            </Typography>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                {formInputs}
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "2rem",
                    }}
                >
                    <Button
                        type="reset"
                        disabled={disableSubmit || isSubmitting}
                        onClick={() => reset()}
                        variant="outlined"
                    >
                        {resetButtonText}
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            (disableSubmit !== undefined && disableSubmit) ||
                            isSubmitting
                        }
                        onClick={handleSubmit(submit)}
                        variant="contained"
                    >
                        {submitButtonText ??
                            (fetchOptions.method === "POST"
                                ? "Create"
                                : "Update")}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default DynamicForm;
