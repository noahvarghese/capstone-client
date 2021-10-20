import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import DialogForm from "src/components/DialogForm";
import { useDelete } from "src/hooks";
import { MemberData } from "..";

const MemberDelete: React.FC<{
    selected: MemberData[];
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
}> = ({ onCancel, selected, ...props }) => {
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({ mode: "all" });

    const { deleteFn } = useDelete("/member");

    return (
        <DialogForm
            {...props}
            onSubmit={handleSubmit(deleteFn)}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage="Member removed"
            title="Delete Member"
            text={
                <span>
                    Are you sure you want to delete member
                    {selected.length > 1 ? "s" : ""}{" "}
                    {selected.map((s) => (
                        <span key={JSON.stringify(s)}>
                            <br />
                            {s.name} &lt;{s.email}&gt;&nbsp;
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
        ></DialogForm>
    );
};

export default MemberDelete;
