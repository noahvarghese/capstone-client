import { Paper, Typography, Box, Button } from "@mui/material";
import {
    Dispatch,
    SetStateAction,
    ReactElement,
    useMemo,
    useCallback,
} from "react";
import { useForm, RegisterOptions, Controller } from "react-hook-form";
import Input from "./Input";

interface BaseInputOptions {
    type: string;
    label: string;
    defaultValue: any;
    registerOptions: RegisterOptions;
}

interface TextOptions extends BaseInputOptions {
    type: "input";
    /**
     * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
     * Only used if type is input
     * @default 'text'
     */
    inputType?: string;
}

interface CheckboxOptions extends BaseInputOptions {
    type: "checkbox";
}

interface SelectOptions extends BaseInputOptions {
    type: "select";
    /**
     * Value is the human readable option
     * Key is what will be sent to the server
     */
    items: { key: string | number; value: string }[];
}

interface HiddenOptions extends BaseInputOptions {
    type: "hidden";
    /**
     * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
     * Only used if type is input
     * @default 'text'
     */
    inputType?: string;
}

export declare type FormInputOptions =
    | TextOptions
    | CheckboxOptions
    | SelectOptions
    | HiddenOptions;

interface DynamicFormProps {
    disableSubmit?: boolean;
    fetchOptions: RequestInit;
    formOptions: {
        [x: string]: FormInputOptions;
    };
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
                ]) => (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        defaultValue={defaultValue}
                        rules={rules}
                        render={({ field }) => (
                            <Input
                                {...rest}
                                error={errors[key]}
                                field={field}
                                disabled={
                                    (disableSubmit !== undefined &&
                                        disableSubmit) ||
                                    disabled ||
                                    isSubmitting
                                }
                            />
                        )}
                    />
                )
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
