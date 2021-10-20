import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Button,
} from "@mui/material";
import React, { useState } from "react";

interface ModalProps {
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    text?: string | React.ReactElement | React.ReactElement[];
    isSubmitting: boolean;
    successMessage: string;
    buttons: [React.ReactElement, React.ReactElement] | [string, string];
    cleanup: () => void;
}

const DialogForm: React.FC<
    ModalProps & { onClose: () => void; open: boolean }
> = ({
    open,
    onClose,
    children,
    title,
    onSubmit,
    text,
    buttons,
    cleanup,
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
            cleanup();
        } catch (e) {
            setAlert({ message: e.message, severity: "error" });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                cleanup();
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
                <DialogActions>
                    {buttons.map((btn: any, index: number) =>
                        typeof btn === "string" ? (
                            <Button
                                key={btn}
                                type={index === 0 ? "reset" : "submit"}
                                onClick={
                                    index === 0
                                        ? () => {
                                              cleanup();
                                              onClose();
                                              setAlert({ message: "" });
                                          }
                                        : undefined
                                }
                            >
                                {btn}
                            </Button>
                        ) : (
                            (btn as React.ReactElement)
                        )
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};

export const DialogFormWithTrigger: React.FC<
    ModalProps & {
        triggerText: string;
    }
> = ({ triggerText, ...props }) => {
    const [open, setModalOpen] = useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    return (
        <>
            <Button type="button" onClick={handleOpen}>
                {triggerText}
            </Button>
            <DialogForm {...props} onClose={handleClose} open={open} />
        </>
    );
};

export default DialogForm;
