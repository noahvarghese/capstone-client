import React from "react";
import { RegisterOptions, useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { usePost } from "src/hooks";

export interface CreateProps {
    url: string;
    defaultValues: { [x: string]: {} | undefined };
    text?: string;
    title: string;
    successMessage: string;
    formElements: {
        params: {
            name: string;
            options?: RegisterOptions;
        };
        component: React.ReactElement;
    }[];
    trigger: string | React.ReactElement;
    buttons: [string, string] | [React.ReactElement, React.ReactElement];
}

const Create = ({
    trigger,
    defaultValues,
    url,
    successMessage,
    title,
    text,
    buttons,
    formElements,
}: CreateProps) => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "all", defaultValues });
    const { submit } = usePost(url);

    return (
        <DialogFormWithTrigger
            variant="contained"
            trigger={trigger}
            onSubmit={handleSubmit(submit)}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage={successMessage}
            title={title}
            text={text}
            buttons={buttons}
        >
            {formElements.map(({ params, component }) => {
                const el = React.cloneElement(component, {
                    ...register(params.name, params.options),
                    value: watch(params.name, defaultValues[params.name]),
                    // only apply default value by hand
                    // defaultValue: defaultValues[params.name],
                    error: Boolean(errors[params.name]),
                    helperText: (errors[params.name] as { message?: string })
                        ?.message,
                    disabled: isSubmitting,
                    id: params.name,
                    placeholder: params.name.split("_").join(" "),
                    label: params.name.split("_").join(" "),
                    key: params.name,
                });

                return el;
            })}
        </DialogFormWithTrigger>
    );
};

export default Create;
