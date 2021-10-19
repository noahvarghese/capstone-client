import { Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import SingleFormModal from "src/components/SingleFormModal";
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
        <SingleFormModal
            reset={reset}
            {...props}
            title="Delete"
            buttons={[
                <Button
                    key="cancel"
                    variant="outlined"
                    type="reset"
                    onClick={() => {
                        reset();
                        onCancel();
                    }}
                >
                    Cancel
                </Button>,
                <Button key="submit" variant="contained" type="submit">
                    Delete
                </Button>,
            ]}
            onSubmit={handleSubmit(deleteFn)}
        >
            <Typography
                variant="body1"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <span style={{ alignSelf: "center" }}>
                    Are you sure you want to delete member
                    {selected.length > 1 ? "s" : ""}
                </span>
                <span
                    style={{
                        display: "flex",
                        padding: "0.5rem 0",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {selected.map((s) => (
                        <span key={JSON.stringify(s)}>
                            {s.name} &lt;{s.email}&gt;
                        </span>
                    ))}
                </span>
                <span style={{ alignSelf: "center" }}>?</span>
            </Typography>
            {isSubmitting && (
                <CircularProgress style={{ alignSelf: "center" }} />
            )}
        </SingleFormModal>
    );
};

export default MemberDelete;
