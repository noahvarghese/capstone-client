import {
    Typography,
    Box,
    Alert,
    Button,
    MenuItem,
    Paper,
    TextField,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Assignment from "src/components/Assignment";
import Loading from "src/components/Loading";
import AppContext, { Member, Role } from "src/context";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";

const UpdateRole: React.FC<{
    role?: Role;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ setAlert, toggleRefresh, role }) => {
    const { roles } = useContext(AppContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all" });

    useEffect(() => {
        reset({ name: role?.name, access: role?.access });
    }, [reset, role?.access, role?.name]);

    const isAdmin = useMemo(
        () => roles.find((r) => r.access === "ADMIN"),
        [roles]
    );

    const submit = useCallback(
        async (data) => {
            if (!role) return;
            await fetch(server(`/roles/${role.id}`), {
                body: JSON.stringify(data),
                method: "PUT",
                credentials: "include",
            })
                .then(async (res) => {
                    if (res.ok) {
                        setAlert({
                            message: `Successfully updated role: ${role.name} <${role.department.name}>`,
                            severity: "success",
                        });
                    } else {
                        setAlert({
                            message:
                                (await res.text()) ??
                                `Unable to update role: ${role.name} <${role.department.name}>`,
                            severity: "error",
                        });
                    }
                    toggleRefresh();
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({
                        message,
                        severity: "error",
                    });
                });
        },
        [role, setAlert, toggleRefresh]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Update Role
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
                    {...register("name", {
                        required: "name cannot be empty",
                    })}
                    label="name"
                    id="name"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    autoComplete="name"
                    value={watch("name", "")}
                    placeholder="name"
                    required
                    disabled={
                        role?.access === "ADMIN" || !isAdmin || isSubmitting
                    }
                />
                <TextField
                    {...register("access", {
                        required: "access cannot be empty",
                    })}
                    select
                    label="access"
                    id="access"
                    error={Boolean(errors.access)}
                    value={watch("access", "")}
                    helperText={errors.access?.message}
                    placeholder="access"
                    required
                    disabled={
                        role?.access === "ADMIN" || !isAdmin || isSubmitting
                    }
                >
                    {role?.access === "ADMIN" ? (
                        <MenuItem key="ADMIN" value="ADMIN">
                            ADMIN
                        </MenuItem>
                    ) : null}
                    <MenuItem key="MANAGER" value="MANAGER">
                        MANAGER
                    </MenuItem>
                    <MenuItem key="USER" value="USER">
                        USER
                    </MenuItem>
                </TextField>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="reset"
                        disabled={
                            role?.access === "ADMIN" || !isAdmin || isSubmitting
                        }
                        onClick={() =>
                            reset({ name: role?.name, access: role?.access })
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            role?.access === "ADMIN" || !isAdmin || isSubmitting
                        }
                    >
                        Update
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

const RoleView = () => {
    const { userId } = useContext(AppContext);
    const { id } = useParams();
    const [role, setRole] = useState<Role | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/roles/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            const r = await res.json();
                            setRole(r);
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({
                                message,
                                severity: "error",
                            });
                        }
                        return;
                    }

                    setAlert({
                        message:
                            (await res.text()) ?? "Unable to retrieve role",
                        severity: "error",
                    });
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({
                        message,
                        severity: "error",
                    });
                })
                .finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [id, refresh]);

    if (!role) {
        return <Loading />;
    }

    return (
        <div
            style={{
                minHeight: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h1">Role</Typography>
            <Typography variant="h2">{role.name}</Typography>
            <Box
                style={{
                    marginTop: "5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5rem",
                }}
            >
                <Box
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                    }}
                >
                    <UpdateRole
                        setAlert={setAlert}
                        role={role}
                        toggleRefresh={() => setRefresh(true)}
                    />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="access"
                                secondary={role.access}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="number of members"
                                secondary={role.num_members}
                            />
                        </ListItem>
                        <MuiLink
                            to={`/departments/${role.department.id}`}
                            component={Link}
                        >
                            <ListItem>
                                <ListItemText
                                    primary="department"
                                    secondary={role.department.name}
                                />
                            </ListItem>
                        </MuiLink>
                    </List>
                </Box>
                <Box>
                    <Assignment
                        toggleRefresh={() => setRefresh(true)}
                        setAlert={setAlert}
                        modelName="members"
                        hideCondition={(m?: Member) => userId !== m?.id}
                        allURL={server("members")}
                        assignedURL={server(`/roles/${role.id}/members`)}
                        assignmentURL={(m?: Member) =>
                            server(`/members/${m?.id}/roles/${role.id}`)
                        }
                        description={(m?: Member) =>
                            `${m?.first_name} ${m?.last_name} <${m?.email}>`
                        }
                        assignmentDescription={(m?: Member) =>
                            `role ${role.name} <${role.department.name}> to member: ${m?.first_name} ${m?.last_name} <${m?.email}>`
                        }
                    />
                </Box>
                <Box>
                    <Assignment
                        setAlert={setAlert}
                        modelName="manuals"
                        hideCondition={() => true}
                        allURL={server("manuals")}
                        assignedURL={server(`/roles/${role.id}/manuals`)}
                        assignmentURL={(m?: Manual) =>
                            server(`/manuals/${m?.id}/roles/${role.id}`)
                        }
                        description={(m?: Manual) => `${m?.title}`}
                        assignmentDescription={(m?: Manual) =>
                            `manual ${m?.title} to role: ${role.name} <${role.department.name}>`
                        }
                    />
                </Box>
            </Box>
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
        </div>
    );
};

export default RoleView;
