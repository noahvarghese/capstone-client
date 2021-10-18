import React, { useState } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    TextField,
    Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import validator from "validator";
import usePost from "src/hooks/post";
import SingleFormPage from "src/components/SingleFormPage";

const Login: React.FC<{ setAuth: (auth: boolean) => void }> = ({ setAuth }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },

        watch,
    } = useForm({ mode: "all" });
    const { submit } = usePost("auth/login");

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const onSubmit = (data: unknown) => {
        submit(data)
            .then(() => setAuth(true))
            .catch(({ message }) => setAlert({ message, severity: "error" }));
    };
    return (
        <SingleFormPage
            onSubmit={handleSubmit(onSubmit)}
            title="Login"
            buttons={[
                <Button
                    key="register"
                    href="/register"
                    type="button"
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Register
                </Button>,
                <Button
                    key="login"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                >
                    Login
                </Button>,
            ]}
        >
            <TextField
                {...register("email", {
                    required: "email cannot be empty",
                    validate: (val: string) =>
                        validator.isEmail(val) || "invalid email",
                })}
                value={watch("email", "")}
                type="email"
                aria-labelledby=""
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
                {...register("password", {
                    required: "password cannot be empty",
                })}
                value={watch("password", "")}
                type="password"
                label="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                required
                placeholder="password"
                disabled={isSubmitting}
            />
            <Link href="/forgotPassword">
                Click here to reset your password
            </Link>
            {isSubmitting && <CircularProgress />}
            {alert.severity && (
                <Alert severity={alert.severity}>{alert.message}</Alert>
            )}
        </SingleFormPage>
    );
};

export default Login;
