import {
    Alert,
    AlertColor,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

    const [alert, setAlert] = useState<{
        message: string;
        severity?: AlertColor;
    }>({ message: "" });

    const { deleteFn } = useDelete("/member");

    const onSubmit = (e: React.BaseSyntheticEvent) => {
        handleSubmit(deleteFn)(e)
            .then(() => {
                setAlert({ message: "Invite sent", severity: "success" });
                reset();
            })
            .catch(({ message }) => setAlert({ message, severity: "error" }));
    };
    return (
        <Dialog {...props} keepMounted={false}>
            <DialogTitle>Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete member
                    {selected.length > 1 ? "s" : ""}{" "}
                    {selected.map((s) => (
                        <span key={JSON.stringify(s)}>
                            <br />
                            {s.name} &lt;{s.email}&gt;&nbsp;
                        </span>
                    ))}
                    ?
                </DialogContentText>
                {isSubmitting && (
                    <CircularProgress style={{ alignSelf: "center" }} />
                )}
                {alert.severity && (
                    <Alert severity={alert.severity}>{alert.message}</Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    key="cancel"
                    type="reset"
                    onClick={() => {
                        reset();
                        onCancel();
                    }}
                >
                    Cancel
                </Button>
                <Button key="submit" type="submit" onClick={onSubmit}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberDelete;
