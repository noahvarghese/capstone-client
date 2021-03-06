import React, { useContext, useState, useCallback } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    TextField,
    Link as MuiLink,
} from "@mui/material";
import { useForm } from "react-hook-form";
import validator from "validator";
import SingleFormPage from "src/components/SingleFormPage";
import AppContext from "src/context";
import { server } from "src/util/permalink";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({ mode: "all", defaultValues: { email: "", password: "" } });

    const { setUserId } = useContext(AppContext);

    const submit = useCallback(
        async (data) => {
            await fetch(server("/auth/login"), {
                body: JSON.stringify(data),
                method: "POST",
                credentials: "include",
                mode: "cors",
            })
                .then((res) => {
                    if (res.ok) {
                        res.json().then(({ user_id }) => setUserId(user_id));
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
                    setAlert({
                        message: (e as Error).message ?? "Invalid login",
                        severity: "error",
                    });
                });
        },
        [setUserId]
    );

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    return (
        <SingleFormPage
            onSubmit={handleSubmit(submit)}
            title="Login"
            buttons={[
                <MuiLink component={Link} to="/register" key="register">
                    <Button variant="outlined" disabled={isSubmitting}>
                        Register
                    </Button>
                </MuiLink>,
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
            <MuiLink to="/forgotPassword" component={Link}>
                Click here to reset your password
            </MuiLink>
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

export default Login;
