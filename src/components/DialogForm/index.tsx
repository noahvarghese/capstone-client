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
import React, { useCallback, useState } from "react";

interface DialogFormProps {
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    text?: string | React.ReactElement | React.ReactElement[];
    isSubmitting: boolean;
    successMessage: string;
    buttons: [React.ReactElement, React.ReactElement] | [string, string];
    cleanup: () => void;
}

const DialogForm: React.FC<
    DialogFormProps & { onClose: () => void; open: boolean }
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

    const close = useCallback(() => {
        cleanup();
        onClose();
        setAlert({ message: "", severity: undefined });
    }, [cleanup, onClose]);

    const submit = useCallback(
        async (e: React.BaseSyntheticEvent) => {
            try {
                await onSubmit(e);
                setAlert({ message: successMessage, severity: "success" });
                close();
            } catch (_e) {
                const { message } = _e as Error;
                setAlert({ message: message, severity: "error" });
            }
        },
        [onSubmit, successMessage, close]
    );

    return (
        <Dialog open={open} onClose={close} keepMounted={false}>
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
                    {buttons.map(
                        (btn: React.ReactElement | string, index: number) =>
                            typeof btn === "string" ? (
                                <Button
                                    key={btn}
                                    type={index === 0 ? "reset" : "submit"}
                                    disabled={isSubmitting}
                                    onClick={index === 0 ? close : undefined}
                                >
                                    {btn}
                                </Button>
                            ) : (
                                React.cloneElement(btn, {
                                    key: index + "Button",
                                    type:
                                        index === 0 && !btn.type
                                            ? "reset"
                                            : "submit",
                                    disabled: isSubmitting,
                                    onClick: index === 0 ? close : undefined,
                                })
                            )
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};

export const DialogFormWithTrigger: React.FC<
    DialogFormProps & {
        trigger: string | React.ReactElement;
        variant?: "text" | "outlined" | "contained" | undefined;
    }
> = ({ trigger, variant, ...props }) => {
    const [open, setModalOpen] = useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    return (
        <>
            {typeof trigger === "string" ? (
                <Button type="button" variant={variant} onClick={handleOpen}>
                    {trigger}
                </Button>
            ) : (
                React.cloneElement(trigger, { onClick: handleOpen })
            )}
            <DialogForm {...props} onClose={handleClose} open={open} />
        </>
    );
};

export default React.memo(DialogForm);
