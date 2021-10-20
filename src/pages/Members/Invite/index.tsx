import { TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { usePost } from "src/hooks";
import { emailValidator, phoneValidator } from "src/util/validators";

const MemberInvite: React.FC = () => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "all",
        // need to set default values for dialog, something to do with the asynchronous loading
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
        },
    });

    const { submit } = usePost("member/invite");

    return (
        <DialogFormWithTrigger
            variant="contained"
            triggerText="invite"
            onSubmit={handleSubmit(submit)}
            isSubmitting={isSubmitting}
            cleanup={reset}
            successMessage="Invite sent"
            title="Invite"
            text="The user will be notified by email"
            buttons={["No Thanks", "Send Invite"]}
        >
            <TextField
                {...register("first_name", {
                    required: "first name cannot be empty",
                })}
                id="first_name"
                autoFocus
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
        </DialogFormWithTrigger>
    );
};

export default MemberInvite;
