import React, { useState } from "react";
import { provinces } from "../../data/provinces";
import {
    Alert,
    Button,
    CircularProgress,
    MenuItem,
    TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import validator from "validator";
import { PhoneNumberUtil } from "google-libphonenumber";
import usePost from "src/hooks/post";
import SingleFormPage from "src/components/SingleFormPage";

const Register: React.FC<{
    setAuth: (authenticated: boolean) => void;
}> = ({ setAuth }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger,
    } = useForm({ mode: "all" });

    const { submit } = usePost("auth/register");

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const onSubmit = (data: unknown) => {
        submit(data)
            .then(() => {
                setAuth(true);
            })
            .catch(({ message }) => {
                setAlert({ message, severity: "error" });
            });
    };

    const watchPassword = watch("password", "");
    const watchConfirmPassword = watch("confirm_password", "");

    return (
        <SingleFormPage
            title="Register"
            onSubmit={handleSubmit(onSubmit)}
            buttons={[
                <Button
                    key="login"
                    href="/"
                    type="button"
                    variant="outlined"
                    disabled={isSubmitting}
                >
                    Login
                </Button>,
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
                    validate: (val: string) => {
                        const phoneUtil = new PhoneNumberUtil();
                        try {
                            const phone = phoneUtil.parseAndKeepRawInput(
                                val,
                                "CA"
                            );
                            if (phoneUtil.isValidNumber(phone)) return true;
                        } catch (_) {}
                        return "invalid phone number";
                    },
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
                    validate: (val: string) =>
                        val === watchPassword || "passwords do not match",
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
                <Alert severity={alert.severity}>{alert.message}</Alert>
            )}
        </SingleFormPage>
    );
};

export default Register;
