import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { FieldValues, UseFormReset } from "react-hook-form";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    buttons: JSX.Element[];
    reset: UseFormReset<FieldValues>;
    text?: string | React.ReactElement | React.ReactElement[];
    isSubmitting: boolean;
    successMessage: string;
}

const DialogForm: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    title,
    reset,
    onSubmit,
    buttons,
    text,
    isSubmitting,
    successMessage,
}) => {
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const submit = async (e: React.BaseSyntheticEvent) => {
        try {
            await onSubmit(e);
            setAlert({ message: successMessage, severity: "success" });
            reset();
        } catch (e) {
            setAlert({ message: e.message, severity: "error" });
        }
    };
    return (
        <Dialog
            open={open}
            onClose={() => {
                reset();
                onClose();
                setAlert({ message: "" });
            }}
            keepMounted={false}
        >
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={submit}>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <DialogContentText>{text}</DialogContentText>
                    {children}
                    {isSubmitting && (
                        <CircularProgress style={{ alignSelf: "center" }} />
                    )}
                    {alert.severity && (
                        <Alert severity={alert.severity}>{alert.message}</Alert>
                    )}
                </DialogContent>
                <DialogActions>{buttons}</DialogActions>
            </form>
        </Dialog>
    );
};

export default DialogForm;
