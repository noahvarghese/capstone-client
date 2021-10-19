import { Modal, Box, Paper, Typography, Alert } from "@mui/material";
import React, { useState } from "react";
import { FieldValues, UseFormReset } from "react-hook-form";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    buttons: JSX.Element[];
    titleVariant?: "h1" | "h2" | "h3";
    reset: UseFormReset<FieldValues>;
}

const SingleFormModal: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    title,
    reset,
    onSubmit,
    buttons,
    titleVariant = "h2",
}) => {
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const submit = async (e: React.BaseSyntheticEvent) => {
        try {
            await onSubmit(e);
            setAlert({ message: "Invite sent", severity: "success" });
            reset();
        } catch (e) {
            setAlert({ message: e.message, severity: "error" });
        }
    };
    return (
        <Modal
            open={open}
            onClose={() => {
                reset();
                onClose();
                setAlert({ message: "" });
            }}
            keepMounted={false}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Paper
                    style={{
                        padding: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <Typography variant={titleVariant}>{title}</Typography>
                    <form
                        onSubmit={submit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        {children}
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent:
                                    buttons.length > 1
                                        ? "space-between"
                                        : "flex-end",
                            }}
                        >
                            {buttons}
                        </div>
                        {alert.severity && (
                            <Alert severity={alert.severity}>
                                {alert.message}
                            </Alert>
                        )}
                    </form>
                </Paper>
            </Box>
        </Modal>
    );
};

export default SingleFormModal;
