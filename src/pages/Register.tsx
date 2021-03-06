import React, { useCallback, useContext, useState } from "react";
import { provinces } from "../data/provinces";
import {
    Alert,
    Button,
    CircularProgress,
    Link as MuiLink,
    MenuItem,
    TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import validator from "validator";
import SingleFormPage from "src/components/SingleFormPage";
import { passwordValidator, phoneValidator } from "src/util/validators";
import { server } from "src/util/permalink";
import AppContext from "src/context";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger,
    } = useForm({
        mode: "all",
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            confirm_password: "",
            name: "",
            address: "",
            city: "",
            postal_code: "",
            province: "",
        },
    });

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const watchPassword = watch("password", "");
    const watchConfirmPassword = watch("confirm_password", "");

    const { setUserId } = useContext(AppContext);

    const submit = useCallback(
        async (data) => {
            await fetch(server("/auth/register"), {
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
                                message: t ?? "Unable to register",
                                severity: "error",
                            })
                        );
                    }
                })
                .catch((e) => {
                    setAlert({
                        message: (e as Error).message ?? "Unable to register",
                        severity: "error",
                    });
                });
        },
        [setUserId]
    );

    return (
        <SingleFormPage
            title="Register"
            onSubmit={handleSubmit(submit)}
            buttons={[
                <MuiLink to="/login" component={Link} key="login">
                    <Button
                        type="button"
                        variant="outlined"
                        disabled={isSubmitting}
                    >
                        Login
                    </Button>
                </MuiLink>,
                <Button
                    key="register"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    Register
                </Button>,
            ]}
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
                    validate: (val: string) =>
                        validator.isEmail(val) || "invalid email",
                })}
                label="email"
                id="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                autoComplete="email"
                type="email"
                value={watch("email", "")}
                placeholder="email"
                required
                disabled={isSubmitting}
            />
            <TextField
                {...register("phone", {
                    required: "phone cannot be empty",
                    validate: phoneValidator,
                })}
                id="phone"
                value={watch("phone", "")}
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                label="phone"
                autoComplete="tel"
                type="tel"
                placeholder="phone"
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                required
            />
            <TextField
                {...register("name", {
                    required: "name cannot be empty",
                })}
                value={watch("name", "")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                type="text"
                id="name"
                label="business name"
                placeholder="business name"
                required
                disabled={isSubmitting}
            />
            <TextField
                {...register("address", {
                    required: "address cannopt be empty",
                })}
                id="address"
                value={watch("address", "")}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                autoComplete="street-address"
                type="text"
                label="address"
                placeholder="address"
                required
                disabled={isSubmitting}
            />
            <TextField
                {...register("city", {
                    required: "city cannot be empty",
                })}
                id="city"
                error={Boolean(errors.city)}
                helperText={errors.city?.message}
                value={watch("city", "")}
                autoComplete="address-level2"
                type="text"
                label="city"
                placeholder="city"
                required
                disabled={isSubmitting}
            />
            <TextField
                {...register("postal_code", {
                    required: "postal code cannot be empty",
                    validate: (val: string) =>
                        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
                            val
                        ) || "invalid postal code",
                })}
                id="postal_code"
                value={watch("postal_code", "")}
                error={Boolean(errors.postal_code)}
                helperText={errors.postal_code?.message}
                type="text"
                label="postal code"
                placeholder="postal code"
                autoComplete="postal-code"
                required
                disabled={isSubmitting}
            />
            <TextField
                {...register("province", {
                    required: "province cannot be empty",
                })}
                id="province"
                label="province"
                placeholder="province"
                required
                value={watch("province", "")}
                error={Boolean(errors.province)}
                helperText={errors.province?.message}
                disabled={isSubmitting}
                select
            >
                {provinces.map(({ label }) => (
                    <MenuItem value={label} key={label}>
                        {label}
                    </MenuItem>
                ))}
            </TextField>
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

export default Register;
