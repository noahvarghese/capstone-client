import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface ConfirmProps {
    description: string;
    // Action such as 'assign' or 'remove'
    title: string;
    method: "PUT" | "POST" | "DELETE";
    url: string;
    open: boolean;
    toggleRefresh: () => void;
    onClose: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}

const Confirm: React.FC<ConfirmProps> = ({
    title,
    url,
    description,
    setAlert,
    toggleRefresh,
    method,
    onClose,
    open,
}) => {
    const [isSubmitting, setSubmitting] = useState(false);
    const submit = useCallback(() => {
        fetch(url, {
            method,
            credentials: "include",
            mode: "cors",
        })
            .then(async (res) => {
                if (res.ok) {
                    toggleRefresh();
                    setAlert({
                        message: `Successfully ${
                            title.toLowerCase() +
                            (title[title.length - 1] === "e" ? "d" : "ed")
                        } ${description}`,
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message:
                            (await res.text()) ??
                            `Unable to ${title.toLowerCase()} ${description}`,
                        severity: "error",
                    });
                }
            })
            .catch((e) => {
                const { message } = e as Error;
                setAlert({
                    message,
                    severity: "error",
                });
            })
            .finally(() => {
                setSubmitting(false);
                onClose();
            });
    }, [description, method, onClose, setAlert, title, toggleRefresh, url]);

    return (
        <Dialog open={open} onClose={onClose} keepMounted={false}>
            <DialogTitle>
                {title[0].toUpperCase()}
                {title.substring(1).toLowerCase()}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Are you sure you want to {title.toLowerCase()} {description}
                    ?
                </Typography>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="reset"
                        disabled={isSubmitting}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={submit}
                    >
                        {title[0].toUpperCase()}
                        {title.substring(1).toLowerCase()}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default Confirm;
