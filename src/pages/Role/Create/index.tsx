import {
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import DialogForm from "src/components/DialogForm";
import { useFetch, usePost } from "src/hooks";

const CreateRole: React.FC<{ onClose: () => void; open: boolean }> = ({
    onClose,
    open,
}) => {
    const {
        register,
        reset,
        formState: { isSubmitting, errors },
        handleSubmit,
        watch,
    } = useForm({ mode: "all" });

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
        <DialogForm
            reset={reset}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(submit)}
            title="Create Role"
            open={open}
            onClose={() => {
                reset({ department_id: "", name: "" });
                onClose();
            }}
            successMessage="Role created"
            buttons={[
                <Button
                    key="reset"
                    onClick={() => {
                        reset({ department_id: "", name: "" });
                        onClose();
                    }}
                >
                    Cancel
                </Button>,
                <Button key="submit" type="submit">
                    Create
                </Button>,
            ]}
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
                value={watch("department_id", "")}
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
                    .concat([<MenuItem value="" key="default"></MenuItem>])}
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
                        <Checkbox {...register("global_crud_department")} />
                    }
                />
                <FormControlLabel
                    label="CRUD role"
                    control={<Checkbox {...register("global_crud_role")} />}
                />
                <FormControlLabel
                    label="CRUD resources"
                    control={
                        <Checkbox {...register("global_crud_resources")} />
                    }
                />
                <FormControlLabel
                    label="assign users to department"
                    control={
                        <Checkbox
                            {...register("global_assign_users_to_department")}
                        />
                    }
                />
                <FormControlLabel
                    label="assign users to role"
                    control={
                        <Checkbox
                            {...register("global_assign_users_to_role")}
                        />
                    }
                />
                <FormControlLabel
                    label="assign resources to department"
                    control={
                        <Checkbox
                            {...register(
                                "global_assign_resources_to_department"
                            )}
                        />
                    }
                />
                <FormControlLabel
                    label="assign resources to role"
                    control={
                        <Checkbox
                            {...register("global_assign_resources_to_role")}
                        />
                    }
                />
                <FormControlLabel
                    label="view reports"
                    control={<Checkbox {...register("global_view_reports")} />}
                />
                <FormControlLabel
                    label="Create role within department"
                    control={<Checkbox {...register("dept_crud_role")} />}
                />
                <FormControlLabel
                    label="Create resources within department"
                    control={<Checkbox {...register("dept_crud_resources")} />}
                />
                <FormControlLabel
                    label="Assign users within department"
                    control={
                        <Checkbox {...register("dept_assign_users_to_role")} />
                    }
                />
                <FormControlLabel
                    label="Assign resources within department"
                    control={
                        <Checkbox
                            {...register("dept_assign_resources_to_role")}
                        />
                    }
                />
            </fieldset>
        </DialogForm>
    );
};

export default CreateRole;
