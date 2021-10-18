import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import SingleFormPage from "src/components/SingleFormPage";
import usePost from "src/hooks/post";

const ResetPassword: React.FC<{ setAuth: (auth: boolean) => void }> = ({
    setAuth,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        watch,
    } = useForm({ mode: "all" });
    const { token } = useParams<{ token: string }>();
    const { submit } = usePost(`auth/resetPassword/${token}`);

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const watchPassword = watch("password", "");
    const watchConfirmPassword = watch("confirm_password", "");

    const onSubmit = (data: unknown) => {
        submit(data)
            .then(() => setAuth(true))
            .catch(({ message }) => setAlert({ message, severity: "error" }));
    };

    return (
        <SingleFormPage
            onSubmit={handleSubmit(onSubmit)}
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
                <Alert severity={alert.severity}>{alert.message}</Alert>
            )}
        </SingleFormPage>
    );
};

export default ResetPassword;
