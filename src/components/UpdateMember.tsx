import { Paper, Typography, TextField, Box, Button } from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Member } from "src/context";
import { server } from "src/util/permalink";
import { phoneValidator } from "src/util/validators";
import validator from "validator";

const birthdayFormatter = (birthday: Date | null): string => {
    if (birthday?.toString() === "Invalid Date") {
        return "";
    }
    const month = (birthday?.getMonth() ?? NaN) + 1;
    const date = birthday?.getDate();
    const year = birthday?.getFullYear();

    return `${year}-${month?.toString().length === 1 ? `0${month}` : month}-${
        date?.toString().length === 1 ? `0${date}` : date
    }`;
};

const UpdateMember: React.FC<{
    member: Member;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ setAlert, toggleRefresh, member }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: {
            first_name: member.first_name,
            last_name: member.last_name,
            email: member.email,
            phone: member.phone,
            birthday: birthdayFormatter(member.birthday),
        },
    });

    const submit = useCallback(
        async (data) => {
            await fetch(server(`/users/${member.id}`), {
                body: JSON.stringify(data),
                method: "PUT",
                credentials: "include",
                mode: "cors",
            })
                .then((res) => {
                    if (res.ok) {
                        setAlert({
                            message: `Successfully updated member: ${member.first_name} ${member.last_name} <${member.email}>`,
                            severity: "success",
                        });
                        toggleRefresh();
                    } else {
                        return res.text().then((t) =>
                            setAlert({
                                message:
                                    t ??
                                    `Unable to update member: ${member.first_name} ${member.last_name} <${member.email}>`,
                                severity: "error",
                            })
                        );
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({
                        message,
                        severity: "error",
                    });
                });
        },
        [
            member.email,
            member.first_name,
            member.id,
            member.last_name,
            setAlert,
            toggleRefresh,
        ]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Update Member
            </Typography>
            <form
                onSubmit={handleSubmit(submit)}
                style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
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
                        validate: (v: unknown) =>
                            validator.isEmpty((v as string) ?? "") ||
                            phoneValidator(v as string),
                    })}
                    id="phone"
                    value={watch("phone", "") ?? ""}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    label="phone"
                    autoComplete="tel"
                    type="tel"
                    placeholder="phone"
                    disabled={isSubmitting}
                />
                <TextField
                    {...register("birthday")}
                    id="birthday"
                    value={watch("birthday", "")}
                    error={Boolean(errors.birthday)}
                    helperText={errors.birthday?.message}
                    label="birthday"
                    autoComplete="birthday"
                    type="date"
                    placeholder="birthday"
                    disabled={isSubmitting}
                />
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="reset"
                        disabled={isSubmitting}
                        onClick={() =>
                            reset({
                                first_name: member.first_name,
                                last_name: member.last_name,
                                email: member.email,
                                phone: member.phone,
                                birthday: birthdayFormatter(member.birthday),
                            })
                        }
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Update
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default UpdateMember;
