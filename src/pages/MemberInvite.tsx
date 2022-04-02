import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import Loading from "src/components/Loading";
import SingleFormPage from "src/components/SingleFormPage";
import { server } from "src/util/permalink";
import { passwordValidator } from "src/util/validators";

const MemberInvite = () => {
    const { token } = useParams<{ token?: string }>();
    const [firstLoadComplete, setFirstLoadComplete] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
        trigger,
    } = useForm({
        mode: "all",
        defaultValues: {
            first_name: "",
            last_name: "",
            password: "",
            confirm_password: "",
        },
    });

    const submit = useCallback(
        async (data) => {
            const controller = new AbortController();

            await fetch(server(`/members/invite/${token}`), {
                body: JSON.stringify(data),
                method: "PUT",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then((res) => {
                    if (res.ok) {
                        setDisabled(true);
                        setAlert({
                            message: `Accepted invitation - Please login to continue`,
                            severity: "success",
                        });
                        reset();
                    } else {
                        setAlert({
                            message: `Unable to accept invitation for user: ${data.email}`,
                            severity: "error",
                        });
                    }
                })
                .catch((e) => {
                    setAlert({
                        message:
                            (e as Error).message ??
                            "Unable to accept invitation",
                        severity: "error",
                    });
                })
                .finally(() => setDisabled(false));

            return controller.abort;
        },
        [reset, token]
    );

    useEffect(() => {
        const controller = new AbortController();

        fetch(server(`/members/invite/${token}`), {
            method: "PUT",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        setAlert({
                            message: "Success - Please login",
                            severity: "success",
                        });
                        break;
                    case 400:
                        setAlert({
                            message: "No membership found",
                            severity: "error",
                        });
                        break;
                    case 405:
                        setDisabled(false);
                        break;
                    case 500:
                        setAlert({
                            message: "Server error",
                            severity: "error",
                        });
                }
            })
            .finally(() => {
                setFirstLoadComplete(true);
            });

        return controller.abort;
    }, [token]);

    if (!firstLoadComplete) {
        return <Loading />;
    }
    // 1. Display loading
    // 2. send query on page load with no body
    // 3. If 405, display form and require  (first_name, last_name, email, password, confirm_password), prompt for birthday and phone before submitting to same url
    // 4. else redirect to login

    const watchPassword = watch("password", "");
    const watchConfirmPassword = watch("confirm_password", "");

    return (
        <SingleFormPage
            onSubmit={handleSubmit(submit)}
            buttons={[
                <Button
                    type="reset"
                    key="reset"
                    disabled={isSubmitting || disabled}
                >
                    Clear
                </Button>,
                <Button
                    type="submit"
                    key="submit"
                    disabled={isSubmitting || disabled}
                >
                    Accept
                </Button>,
            ]}
            title="New Member"
        >
            <TextField
                {...register("first_name", {
                    required: "first name cannot be empty",
                })}
                id="first_name"
                autoComplete="given-name"
                placeholder="first name"
                type="text"
                error={Boolean(errors.first_name)}
                helperText={errors.first_name?.message}
                label="first name"
                value={watch("first_name", "")}
                required
                disabled={isSubmitting || disabled}
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
                disabled={isSubmitting || disabled}
            />
            <TextField
                {...register("password", {
                    required: "password cannot be empty",
                    min: 8,
                    validate: async (_) => {
                        await trigger("confirm_password");
                        return true;
                    },
                })}
                id="password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                value={watchPassword}
                type="password"
                autoComplete="new-password"
                placeholder="password"
                label="password"
                required
                disabled={isSubmitting || disabled}
            />
            <TextField
                {...register("confirm_password", {
                    required: "confirm password cannot be empty",
                    min: 8,
                    validate: passwordValidator(watchPassword),
                })}
                autoComplete="new-password"
                type="password"
                id="confirm_password"
                value={watchConfirmPassword}
                error={Boolean(errors.confirm_password)}
                helperText={errors.confirm_password?.message}
                label="confirm password"
                placeholder="confirm password"
                disabled={isSubmitting || disabled}
                required
            />
            {isSubmitting && <CircularProgress />}
            {alert.severity && (
                <Alert
                    severity={alert.severity}
                    style={{ marginTop: "2rem" }}
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

export default MemberInvite;
