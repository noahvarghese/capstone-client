import {
    Alert,
    Button,
    CircularProgress,
    TextField,
    Link,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SingleFormPage from "src/components/SingleFormPage";
import { usePost } from "src/hooks";
import validator from "validator";

const ForgotPassword: React.FC = () => {
    const {
        watch,
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({ mode: "all" });

    const { submit } = usePost("auth/forgotPassword");
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "error" | "warning" | "info" | "success";
    }>({ message: "", severity: undefined });

    const onSubmit = (data: unknown) => {
        submit(data)
            .then(() =>
                setAlert({
                    message: "instructions were emailed to you",
                    severity: "success",
                })
            )
            .catch((err) => {
                console.error(err);
                setAlert({
                    message: "failed to send instructions",
                    severity: "error",
                });
            });
    };

    return (
        <SingleFormPage
            title="Forgot Password"
            onSubmit={handleSubmit(onSubmit)}
            buttons={[
                <Button
                    variant="contained"
                    type="submit"
                    key="submit"
                    disabled={isSubmitting}
                >
                    Submit
                </Button>,
            ]}
        >
            <TextField
                type="email"
                required
                autoComplete="email"
                value={watch("email", "")}
                id="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                placeholder="email"
                label="email"
                disabled={isSubmitting}
                {...register("email", {
                    required: "email cannot be empty",
                    validate: (val: string) =>
                        validator.isEmail(val) || "invalid email",
                })}
            />
            <Link href="/">Go back to login</Link>
            {isSubmitting && <CircularProgress />}
            {alert.severity && (
                <Alert severity={alert.severity}>{alert.message}</Alert>
            )}
        </SingleFormPage>
    );
};

export default ForgotPassword;
