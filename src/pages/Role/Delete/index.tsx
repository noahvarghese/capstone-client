import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import DialogForm from "src/components/DialogForm";
import { useDelete } from "src/hooks";
import { RoleData } from "..";

interface DeleteRoleProps {
    selected: RoleData[];
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
}

const DeleteRole: React.FC<DeleteRoleProps> = ({
    onCancel,
    selected,
    ...props
}) => {
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({ mode: "all" });

    const { deleteFn } = useDelete("/role");

    return (
        <DialogForm
            {...props}
            onSubmit={handleSubmit((_) =>
                deleteFn({ ids: selected.map((s) => s.id) })
            )}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage="Role deleted"
            title="Delete Role"
            text={
                <span>
                    Are you sure you want to delete role
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

export default DeleteRole;
