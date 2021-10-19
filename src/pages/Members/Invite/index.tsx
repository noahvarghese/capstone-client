import {
    Button,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Alert,
    AlertColor,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePost } from "src/hooks";
import { emailValidator, phoneValidator } from "src/util/validators";

const MemberInvite: React.FC<{ open: boolean; onClose: () => void }> = (
    props
) => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "all" });

    const [alert, setAlert] = useState<{
        message: string;
        severity?: AlertColor;
    }>({ message: "" });

    const { submit } = usePost("member/invite");

    const onSubmit = (e: React.BaseSyntheticEvent) => {
        handleSubmit(submit)(e)
            .then(() => {
                setAlert({ message: "Invite sent", severity: "success" });
                reset();
            })
            .catch(({ message }) => setAlert({ message, severity: "error" }));
    };

    useEffect(() => {});

    return (
        <Dialog {...props} keepMounted={false}>
            <form>
                <DialogTitle>Invite</DialogTitle>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <DialogContentText>
                        The user will be notified by email
                    </DialogContentText>
                    <TextField
                        {...register("first_name", {
                            required: "first name cannot be empty",
                        })}
                        id="first_name"
                        autoFocus
                        autoComplete="given-name"
                        placeholder="first name"
                        type="text"
                        error={Boolean(errors.first_name)}
                        helperText={errors.first_name?.message}
                        label="first name"
                        value={watch("first_name", "")}
                        required
                        disabled={isSubmitting}
                    />
                    <TextField
                        {...register("last_name", {
                            required: "last name cannot be empty",
                        })}
                        error={Boolean(errors.last_name)}
                        helperText={errors.last_name?.message}
                        label="last name"
                        id="last_name"
                        type="text"
                        autoComplete="family-name"
                        value={watch("last_name", "")}
                        placeholder="last name"
                        required
                        disabled={isSubmitting}
                    />
                    <TextField
                        {...register("email", {
                            required: "email cannot be empty",
                            validate: emailValidator,
                        })}
                        value={watch("email", "")}
                        type="email"
                        autoComplete="email"
                        id="email"
                        label="email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        required
                        placeholder="email"
                        disabled={isSubmitting}
                    />
                    <TextField
                        {...register("phone", {
                            required: "phone cannot be empty",
                            validate: phoneValidator,
                        })}
                        value={watch("phone", "")}
                        type="tel"
                        autoComplete="tel"
                        id="phone"
                        label="phone"
                        error={Boolean(errors.phone)}
                        helperText={errors.phone?.message}
                        required
                        placeholder="phone"
                        disabled={isSubmitting}
                    />
                    {isSubmitting && (
                        <CircularProgress style={{ alignSelf: "center" }} />
                    )}
                    {alert.severity && (
                        <Alert severity={alert.severity}>{alert.message}</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        key="reset"
                        onClick={() => {
                            reset();
                            props.onClose();
                        }}
                        disabled={isSubmitting}
                    >
                        No Thanks
                    </Button>
                    <Button
                        onClick={onSubmit}
                        key="invite"
                        disabled={isSubmitting}
                    >
                        Send Invite
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default MemberInvite;
