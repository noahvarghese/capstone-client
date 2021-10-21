import { TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { usePost } from "src/hooks";

const CreateDepartment: React.FC = () => {
    const {
        register,
        reset,
        formState: { isSubmitting, errors },
        handleSubmit,
        watch,
    } = useForm({ mode: "all", defaultValues: { name: "" } });

    const { submit } = usePost("department");

    return (
        <DialogFormWithTrigger
            trigger="Create Department"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(submit)}
            title="Create Department"
            cleanup={() => reset()}
            buttons={["Cancel", "Create"]}
            successMessage="Department created"
        >
            <TextField
                {...register("name", { required: "name cannot be empty" })}
                id="name"
                label="name"
                placeholder="name"
                value={watch("name")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                required
            />
        </DialogFormWithTrigger>
    );
};

export default CreateDepartment;
