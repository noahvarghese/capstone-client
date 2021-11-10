import { FormControlLabel } from "@mui/material";
import React from "react";
import { RegisterOptions, useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { usePost } from "src/hooks";
import Emitter from "src/services/emitter";

export interface IFormElement {
    params: {
        name: string;
        options?: RegisterOptions;
    };
    label?: string;
    component: React.ReactElement;
}

export type IFormElementGroup = (
    | IFormElement
    | { legend: string; formElements: IFormElement[] }
)[];

export interface CreateProps {
    url: string;
    defaultValues: { [x: string]: {} | undefined };
    text?: string;
    title: string;
    successMessage: string;
    formElements: IFormElementGroup;
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
            onSubmit={async (e?: React.BaseSyntheticEvent) => {
                await handleSubmit(submit)(e);
                Emitter.emit("REFRESH");
            }}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage={successMessage}
            title={title}
            text={text}
            buttons={buttons}
        >
            {formElements.map((item) => {
                const cb = ({ component, params, label }: IFormElement) => {
                    if (label) {
                        const el = (
                            <FormControlLabel
                                label={label}
                                key={label}
                                control={React.cloneElement(component, {
                                    ...register(params.name, params.options),
                                })}
                            />
                        );
                        return el;
                    } else {
                        const el = React.cloneElement(component, {
                            ...register(params.name, params.options),
                            value: watch(
                                params.name,
                                defaultValues[params.name]
                            ),
                            // only apply default value by hand
                            // defaultValue: component.props.select
                            //     ? defaultValues[params.name]
                            //     : undefined,
                            error: Boolean(errors[params.name]),
                            helperText: (
                                errors[params.name] as { message?: string }
                            )?.message,
                            disabled: isSubmitting,
                            id: params.name,
                            placeholder: params.name.split("_").join(" "),
                            label: params.name.split("_").join(" "),
                            key: params.name,
                            required: Boolean(params.options?.required),
                        });
                        return el;
                    }
                };

                if (Object.keys(item).includes("formElements")) {
                    const el = item as {
                        legend: string;
                        formElements: IFormElement[];
                    };
                    return (
                        <fieldset
                            key={`fieldset${el.legend}`}
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <legend>{el.legend}</legend>
                            {el.formElements.map((i) => cb(i))}
                        </fieldset>
                    );
                } else {
                    const el = cb(item as IFormElement);
                    return el;
                }
            })}
        </DialogFormWithTrigger>
    );
};

export default Create;
