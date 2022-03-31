import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import SingleFormPage from "src/components/SingleFormPage";
import { server } from "src/util/permalink";

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        watch,
    } = useForm({
        mode: "all",
        defaultValues: { password: "", confirm_password: "" },
    });

    const { token } = useParams();

    const submit = useCallback(
        async (data) => {
            await fetch(server(`/auth/reset_password/${token}`), {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                mode: "cors",
            })
                .then((res) => {
                    if (res.ok) {
                        navigate("/");
                    } else {
                        res.text().then((t) =>
                            setAlert({
                                message: t ?? "Invalid login",
                                severity: "error",
                            })
                        );
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                });
        },
        // do not include navigate otherwise it triggers a refresh everytime the url changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [token]
    );

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const watchPassword = watch("password", "");
    const watchConfirmPassword = watch("confirm_password", "");

    return (
        <SingleFormPage
            onSubmit={handleSubmit(submit)}
            title="Reset Password"
            buttons={[
                <Button
                    key="submit"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    Submit
                </Button>,
            ]}
        >
            <TextField
                {...register("password", {
                    required: "password cannot be empty",
                    validate: async (_) => {
                        await trigger("confirm_password");
                        return true;
                    },
                    min: 8,
                })}
                id="password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                type="password"
                label="password"
                value={watchPassword}
                placeholder="password"
                autoComplete="new-password"
                required
                disabled={isSubmitting}
            />
            <TextField
                type="password"
                id="confirm_password"
                autoComplete="new-password"
                label="confirm password"
                placeholder="confirm password"
                {...register("confirm_password", {
                    required: "confirm password cannot be empty",
                    validate: (val: string) =>
                        val === watchPassword || "passwords do not match",
                })}
                value={watchConfirmPassword}
                error={Boolean(errors.confirm_password)}
                helperText={errors.confirm_password?.message}
                disabled={isSubmitting}
            />
            {isSubmitting && <CircularProgress />}
            {alert.severity && (
                <Alert
                    onClose={() =>
                        setAlert({ message: "", severity: undefined })
                    }
                    severity={alert.severity}
                >
                    {alert.message}
                </Alert>
            )}
        </SingleFormPage>
    );
};

export default ResetPassword;
