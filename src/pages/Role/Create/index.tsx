import { Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { DialogFormWithTrigger } from "src/components/DialogForm";
import { useFetch, usePost } from "src/hooks";

const CreateRole: React.FC = () => {
    const {
        register,
        reset,
        formState: { isSubmitting, errors },
        handleSubmit,
        watch,
    } = useForm({
        mode: "all",
        defaultValues: {
            department_id: 0,
            name: "",
            global_crud_users: false,
            global_crud_departments: false,
            global_crud_roles: false,
            global_crud_resources: false,
            global_assign_users_to_departments: false,
            global_assign_users_to_roles: false,
            global_assign_resources_to_departments: false,
            global_assign_resources_to_roles: false,
            global_view_reports: false,
            dept_crud_roles: false,
            dept_crud_resources: false,
            dept_assign_users_to_roles: false,
            dept_assign_resources_to_roles: false,
        },
    });

    const { submit } = usePost("role");

    const { data: departments } = useFetch<
        { id: number; name: string; numMembers: number; numRoles: number }[]
    >(
        "department",
        [],
        {
            method: "GET",
            credentials: "include",
        },
        "data"
    );

    return (
        <DialogFormWithTrigger
            variant="contained"
            trigger="create"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(submit)}
            title="Create Role"
            cleanup={reset}
            successMessage="Role created"
            buttons={["Cancel", "Create"]}
        >
            <TextField
                {...register("name", { required: "name cannot be empty" })}
                id="name"
                label="name"
                placeholder="name"
                value={watch("name", "")}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                required
            />
            <TextField
                {...register("department_id", {
                    required: "role must belong to a department",
                })}
                id="department_id"
                label="department"
                placeholder="department"
                value={watch("department_id", 0) ?? 0}
                defaultValue={watch("department_id", 0) ?? 0}
                error={Boolean(errors.department_id)}
                helperText={errors.department_id?.message}
                required
                disabled={isSubmitting}
                select
            >
                {departments
                    .map((d) => (
                        <MenuItem value={d.id} key={d.name}>
                            {d.name}
                        </MenuItem>
                    ))
                    .concat([<MenuItem value={0} key="default"></MenuItem>])}
            </TextField>
            <fieldset
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.2rem",
                }}
            >
                <legend>Permissions</legend>
                <FormControlLabel
                    label="CRUD users"
                    control={<Checkbox {...register("global_crud_users")} />}
                />
                <FormControlLabel
                    label="CRUD department"
                    control={
                        <Checkbox {...register("global_crud_departments")} />
                    }
                />
                <FormControlLabel
                    label="CRUD role"
                    control={<Checkbox {...register("global_crud_roles")} />}
                />
                <FormControlLabel
                    label="CRUD resources"
                    control={
                        <Checkbox {...register("global_crud_resources")} />
                    }
                />
                <FormControlLabel
                    label="Assign users to department"
                    control={
                        <Checkbox
                            {...register("global_assign_users_to_departments")}
                        />
                    }
                />
                <FormControlLabel
                    label="Assign users to role"
                    control={
                        <Checkbox
                            {...register("global_assign_users_to_roles")}
                        />
                    }
                />
                <FormControlLabel
                    label="Assign resources to department"
                    control={
                        <Checkbox
                            {...register(
                                "global_assign_resources_to_departments"
                            )}
                        />
                    }
                />
                <FormControlLabel
                    label="Assign resources to role"
                    control={
                        <Checkbox
                            {...register("global_assign_resources_to_roles")}
                        />
                    }
                />
                <FormControlLabel
                    label="View reports"
                    control={<Checkbox {...register("global_view_reports")} />}
                />
                <FormControlLabel
                    label="Create role within department"
                    control={<Checkbox {...register("dept_crud_roles")} />}
                />
                <FormControlLabel
                    label="Create resources within department"
                    control={<Checkbox {...register("dept_crud_resources")} />}
                />
                <FormControlLabel
                    label="Assign users within department"
                    control={
                        <Checkbox {...register("dept_assign_users_to_roles")} />
                    }
                />
                <FormControlLabel
                    label="Assign resources within department"
                    control={
                        <Checkbox
                            {...register("dept_assign_resources_to_roles")}
                        />
                    }
                />
            </fieldset>
        </DialogFormWithTrigger>
    );
};

export default CreateRole;
