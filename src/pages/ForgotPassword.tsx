import {
    Alert,
    Button,
    CircularProgress,
    TextField,
    Link,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import SingleFormPage from "src/components/SingleFormPage";
import { server } from "src/util/permalink";
import validator from "validator";

const ForgotPassword: React.FC = () => {
    const {
        watch,
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({ mode: "all", defaultValues: { email: "" } });

    const submit = useCallback(async (data) => {
        await fetch(server("/auth/forgot_password"), {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
            mode: "cors",
        })
            .then((res) => {
                if (res.ok) {
                    setAlert({
                        message: "Instructions have been sent to your email",
                        severity: "success",
                    });
                } else {
                    res.text().then((t) =>
                        setAlert({
                            message: t ?? "Unable to reset password",
                            severity: "error",
                        })
                    );
                }
            })
            .catch((e) => {
                setAlert({
                    message: (e as Error).message ?? "Unable to reset password",
                    severity: "error",
                });
            });
    }, []);

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "error" | "warning" | "info" | "success";
    }>({ message: "", severity: undefined });

    return (
        <SingleFormPage
            title="Forgot Password"
            onSubmit={handleSubmit(submit)}
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
            <Link href="/login">Go back to login</Link>
            {isSubmitting && <CircularProgress />}
            {alert.severity && (
                <Alert
                    severity={alert.severity}
                    onClose={() =>
                        setAlert({ message: "", severity: undefined })
                    }
                >
                    {alert.message}
                </Alert>
            )}
        </SingleFormPage>
    );
};

export default ForgotPassword;
