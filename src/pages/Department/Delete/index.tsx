import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import DialogForm from "src/components/DialogForm";
import { useDelete } from "src/hooks";
import { DepartmentData } from "..";

interface DeleteDepartmentProps {
    selected: DepartmentData[];
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
}

const DeleteDepartment: React.FC<DeleteDepartmentProps> = ({
    onCancel,
    selected,
    ...props
}) => {
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({ mode: "all" });

    const { deleteFn } = useDelete("/department");

    return (
        <DialogForm
            {...props}
            onSubmit={handleSubmit((_) =>
                deleteFn({ ids: selected.map((s) => s.id) })
            )}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage="Department deleted"
            title="Delete Department"
            text={
                <span>
                    Are you sure you want to delete department
                    {selected.length > 1 ? "s" : ""}{" "}
                    {selected.map((s) => (
                        <span key={JSON.stringify(s)}>
                            <br />
                            {s.name} &nbsp;
                        </span>
                    ))}
                    ?
                </span>
            }
            buttons={[
                <Button
                    key="cancel"
                    type="reset"
                    onClick={() => {
                        reset();
                        onCancel();
                    }}
                >
                    Cancel
                </Button>,
                <Button key="submit" type="submit">
                    Delete
                </Button>,
            ]}
        />
    );
};

export default DeleteDepartment;
