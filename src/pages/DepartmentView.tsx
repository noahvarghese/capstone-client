import {
    TextField,
    Box,
    Button,
    Typography,
    Alert,
    Paper,
    TableRow,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    MenuItem,
    ListItem,
    List,
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
import { useNavigate, useParams } from "react-router";
import AppContext, { Department, Role } from "src/context";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Delete } from "@mui/icons-material";
import Confirm from "src/components/Confirmation";

export const UpdateDepartment: React.FC<{
    department: Department;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ toggleRefresh, setAlert, department }) => {
    const { roles } = useContext(AppContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all", defaultValues: { name: department.name } });

    useEffect(() => {
        reset({ name: department.name });
    }, [reset, department.name]);

    const submit = useCallback(
        async (data) => {
            await fetch(server(`/departments/${department.id}`), {
                body: JSON.stringify(data),
                method: "PUT",
                credentials: "include",
            }).then(async (res) => {
                if (res.ok) {
                    toggleRefresh();
                    setAlert({
                        message: "Success",
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: "Unable to update department",
                        severity: "error",
                    });
                    reset();
                }
            });
        },
        [department.id, toggleRefresh, setAlert, reset]
    );

    const isAdmin = useMemo(
        () => roles.find((r) => r.access === "ADMIN"),
        [roles]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Update Department
            </Typography>
            <form
                style={{
                    padding: "1rem 0 0.5rem 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <TextField
                    style={{ margin: "0.5rem 0" }}
                    {...register("name", {
                        required: "name cannot be empty",
                    })}
                    label="name"
                    id="name"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    autoComplete="name"
                    type="name"
                    value={watch("name", department.name)}
                    placeholder="name"
                    required
                    disabled={!isAdmin || isSubmitting}
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
                        disabled={!isAdmin || isSubmitting}
                        onClick={() => reset({ name: department.name })}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isAdmin || isSubmitting}
                        onClick={handleSubmit(submit)}
                    >
                        Update
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

const DepartmentRoles: React.FC<{
    department: Department;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ department, setAlert }) => {
    const [refresh, setRefresh] = useState(true);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState<Role | undefined>();
    const { roles: userRoles } = useContext(AppContext);
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>([]);
    const isAdmin = useMemo(
        () => userRoles.find((r) => r.access === "ADMIN"),
        [userRoles]
    );

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/departments/${department.id}/roles`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            setRoles(await res.json());
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message: "Unable to load roles",
                        severity: "error",
                    });
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                })
                .finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [department.id, refresh, setAlert]);

    return (
        <Box
            style={{
                display: "flex",
                gap: "2rem",
            }}
        >
            {isAdmin ? (
                <AddRole
                    setAlert={setAlert}
                    department={department}
                    toggleRefresh={() => {
                        setRefresh(true);
                    }}
                />
            ) : null}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>name</TableCell>
                            <TableCell>access</TableCell>
                            <TableCell>number of members</TableCell>
                            <TableCell>department</TableCell>
                            {isAdmin ? <TableCell></TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((r) => (
                            <TableRow
                                key={r.id}
                                hover={true}
                                onClick={() => {
                                    setSelected(r);
                                    navigate(`/roles/${r.id}`);
                                }}
                            >
                                <TableCell>{r.name}</TableCell>
                                <TableCell>{r.access}</TableCell>
                                <TableCell>{r.num_members}</TableCell>
                                <TableCell>{department.name}</TableCell>
                                {isAdmin ? (
                                    <TableCell>
                                        <Button
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(r);
                                                setShowDelete(true);
                                            }}
                                        >
                                            <Delete />
                                        </Button>
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Confirm
                title="Delete"
                method="DELETE"
                description={`${selected?.name}`}
                toggleRefresh={() => setRefresh(true)}
                url={server(`/roles/${selected?.id}`)}
                setAlert={setAlert}
                open={showDelete}
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
            />
        </Box>
    );
};

const AddRole: React.FC<{
    department: Department;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ department, toggleRefresh, setAlert }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all" });
    const submit = useCallback(
        (data) => {
            fetch(server("/roles"), {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    department_id: department.id,
                }),
                mode: "cors",
                credentials: "include",
            })
                .then((res) => {
                    if (res.ok) {
                        toggleRefresh();
                        reset({ name: "", access: "" });
                        return;
                    } else {
                        setAlert({
                            message: "Unable to add role",
                            severity: "error",
                        });
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                });
        },
        [department.id, reset, setAlert, toggleRefresh]
    );
    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                Add Role
            </Typography>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <TextField
                    style={{ margin: "0.5rem 0" }}
                    {...register("name", {
                        required: "name cannot be empty",
                    })}
                    label="name"
                    id="name"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    autoComplete="name"
                    type="name"
                    value={watch("name", "")}
                    placeholder="name"
                    required
                    disabled={isSubmitting}
                />
                <TextField
                    {...register("access", {
                        required: "access cannot be empty",
                    })}
                    select
                    label="access"
                    id="access"
                    value={watch("access", "")}
                    error={Boolean(errors.access)}
                    helperText={errors.access?.message}
                    placeholder="access"
                    required
                    disabled={isSubmitting}
                >
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
                        disabled={isSubmitting}
                        onClick={() => reset()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={handleSubmit(submit)}
                    >
                        Create
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

const DepartmentView = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState<Department | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/departments/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            setDepartment(await res.json());
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
                            (await res.text()) ??
                            "Unable to retrieve department",
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

    if (!department) {
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
            <Typography variant="h1">Department</Typography>
            <Typography variant="h2">{department.name}</Typography>
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
                    <UpdateDepartment
                        setAlert={setAlert}
                        toggleRefresh={() => setRefresh(true)}
                        department={department}
                    />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="number of managers"
                                secondary={department.num_managers}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="number of members"
                                secondary={department.num_members}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="number of roles"
                                secondary={department.num_roles}
                            />
                        </ListItem>
                    </List>
                </Box>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2rem",
                    }}
                >
                    <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                        Roles
                    </Typography>
                    <DepartmentRoles
                        setAlert={setAlert}
                        department={department}
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

export default DepartmentView;
