import { Button, CircularProgress, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import SingleFormModal from "src/components/SingleFormModal";
import { usePost } from "src/hooks";
import { emailValidator, phoneValidator } from "src/util/validators";

const MemberInvite: React.FC<{ open: boolean; onClose: () => void }> = (
    props
) => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "all" });

    const { submit } = usePost("member/invite");

    return (
        <SingleFormModal
            {...props}
            onSubmit={handleSubmit(submit)}
            reset={reset}
            title="Invite"
            buttons={[
                <Button
                    key="invite"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    Invite
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
                    validate: emailValidator,
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
                {...register("phone", {
                    required: "phone cannot be empty",
                    validate: phoneValidator,
                })}
                value={watch("phone", "")}
                type="tel"
                autoComplete="tel"
                id="phone"
                label="phone"
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                required
                placeholder="phone"
                disabled={isSubmitting}
            />
            {isSubmitting && (
                <CircularProgress style={{ alignSelf: "center" }} />
            )}
        </SingleFormModal>
    );
};

export default MemberInvite;
