import { useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { useDelete } from "src/hooks";

export interface DeleteProps<T extends Partial<{ id: number }>> {
    trigger: React.ReactElement | string;
    formatter: (s: T) => string | React.ReactElement;
}

const Delete = <T extends Partial<{ id: number }>>({
    url,
    name,
    selected,
    formatter,
    trigger,
}: DeleteProps<T> & {
    name: string;
    url: string;
    selected: T[];
}) => {
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({ mode: "all" });
    const { deleteFn } = useDelete(url);

    return (
        <DialogFormWithTrigger
            onSubmit={handleSubmit((_) =>
                deleteFn({ ids: selected.map((s) => s.id) })
            )}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage={`${name} removed`}
            title={`delete ${name}`}
            text={
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
            }
            buttons={["Cancel", "Delete"]}
            trigger={trigger}
        ></DialogFormWithTrigger>
    );
};

export default Delete;
