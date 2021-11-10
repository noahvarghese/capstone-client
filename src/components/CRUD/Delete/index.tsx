import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { useDelete } from "src/hooks";
import Emitter from "src/services/emitter";

export interface DeleteProps<T extends Partial<{ id: number }>> {
    trigger: React.ReactElement | string;
    formatter: (s: T) => string | React.ReactElement;
}

interface DeleteItemProps<T> {
    name: string;
    url: string;
    selected: T[];
}

const Delete = <T extends Partial<{ id: number }>>({
    url,
    name,
    selected,
    formatter,
    trigger,
}: DeleteProps<T> & DeleteItemProps<T>) => {
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({ mode: "all" });

    const { deleteFn } = useDelete(url);

    const submit = useCallback(
        async (e?: React.BaseSyntheticEvent): Promise<void> => {
            e?.preventDefault();
            e?.stopPropagation();
            await handleSubmit(async () => {
                await deleteFn({ ids: selected.map((s) => s.id) });
                Emitter.emit("REFRESH");
            })();
        },
        [deleteFn, handleSubmit, selected]
    );

    useEffect(() => {
        if (selected.length === 0) {
        }
    });

    const text = useMemo(
        () => (
            <span>
                Are you sure you want to delete {name.toLowerCase()}
                {selected.length > 1 ? "s" : ""}{" "}
                {selected.map((s) => (
                    <span key={JSON.stringify(s)}>
                        <br />
                        {formatter(s)}
                    </span>
                ))}
                ?
            </span>
        ),
        [formatter, name, selected]
    );

    return selected.length > 0 ? (
        <DialogFormWithTrigger
            onSubmit={submit}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage={`${name} removed`}
            title={`delete ${name}`}
            text={text}
            buttons={["Cancel", "Delete"]}
            trigger={trigger}
        ></DialogFormWithTrigger>
    ) : (
        <></>
    );
};

export default Delete;
