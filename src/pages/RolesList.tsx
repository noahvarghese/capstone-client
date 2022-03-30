import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
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
import AddIcon from "@mui/icons-material/Add";
import AppContext, { Department, Role } from "src/context";
import { server } from "src/util/permalink";
import { useForm } from "react-hook-form";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router";
import useDepartments from "src/hooks/data/useDepartments";
import usePagination from "src/hooks/usePagination";
import useSort from "src/hooks/useSort";
import Confirm from "src/components/Confirmation";

const CreateRole: React.FC<{
    departments: Department[];
    refresh: () => void;
    open: boolean;
    onClose: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ open, refresh, onClose, departments, setAlert }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: {
            access: "",
            department_id: "",
            name: "",
        },
    });

    const close = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const submit = useCallback(
        async (data) => {
            await fetch(server("/roles"), {
                body: JSON.stringify(data),
                method: "POST",
                credentials: "include",
                mode: "cors",
            }).then(async (res) => {
                if (res.ok) {
                    refresh();
                    setAlert({
                        message: "Success",
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: "Unable to create role",
                        severity: "error",
                    });
                }
                close();
            });
        },
        [close, refresh, setAlert]
    );

    return (
        <Dialog open={open} onClose={close} keepMounted={false}>
            <DialogTitle>Create</DialogTitle>
            <DialogContent>
                <form
                    onSubmit={handleSubmit(submit)}
                    style={{
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
                        value={watch("name")}
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
                        value={watch("access")}
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
                    <TextField
                        {...register("department_id", {
                            required: "department cannot be empty",
                        })}
                        select
                        label="department"
                        id="department"
                        value={watch("department_id")}
                        error={Boolean(errors.department_id)}
                        helperText={errors.department_id?.message}
                        placeholder="department"
                        required
                        disabled={isSubmitting}
                    >
                        {departments.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.name}
                            </MenuItem>
                        ))}
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
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Create
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Roles = () => {
    const { roles: userRoles } = useContext(AppContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Role | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const { page, limit, onPageChange, onRowsPerPageChange } = usePagination(
        5,
        () => setRefresh(true)
    );
    const [count, setCount] = useState(0);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const departments = useDepartments(setAlert);
    const [filter, setFilter] = useState<number | undefined>();
    const { sortCallback, sortColumn, sortOrder } = useSort(() =>
        setRefresh(true)
    );

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(
                server(
                    `/roles/?page=${page + 1}&limit=${limit}${
                        sortColumn
                            ? `&sort_field=${sortColumn}&sort_order=${sortOrder.toUpperCase()}`
                            : ""
                    }${
                        filter
                            ? `&filter_field=department&filter_ids=${JSON.stringify(
                                  [filter]
                              )}`
                            : ""
                    }${search ? `&search=${search}` : ""}`
                ),
                {
                    method: "GET",
                    credentials: "include",
                    mode: "cors",
                    signal: controller.signal,
                }
            )
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            const data = await res.json();
                            setRoles(data.data);
                            setCount(data.count);
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message: "Unable to retrieve roles",
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
    }, [filter, limit, page, refresh, search, sortColumn, sortOrder]);

    const isAdmin = useMemo(
        () => userRoles.find((r) => r.access === "ADMIN"),
        [userRoles]
    );

    return (
        <div
            className="Roles"
            style={{
                minHeight: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h1">Roles</Typography>
            <Box
                style={{
                    margin: "2rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                }}
                sx={{
                    width: {
                        xl: "75%",
                        lg: "90%",
                        md: "90%",
                        sm: "90%",
                        xs: "90%",
                    },
                }}
            >
                <Box style={{ display: "flex", gap: "2rem" }}>
                    <TextField
                        type="text"
                        value={search}
                        placeholder="search"
                        label="search"
                        id="search"
                        style={{ width: "20rem" }}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setRefresh(true);
                        }}
                    />
                    <TextField
                        select
                        label="filter by department"
                        id="department"
                        placeholder="department"
                        style={{ width: "15rem" }}
                        onChange={(e) => {
                            const id =
                                e.target.value === undefined
                                    ? undefined
                                    : Number(e.target.value);
                            setFilter(id);
                            setRefresh(true);
                        }}
                        value={filter && filter > 0 ? filter : ""}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {departments.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                {isAdmin ? (
                    <Fab
                        color="primary"
                        onClick={() => setShowCreate(!showCreate)}
                    >
                        <AddIcon />
                    </Fab>
                ) : null}
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    width: {
                        xl: "75%",
                        lg: "90%",
                        md: "90%",
                        sm: "90%",
                        xs: "90%",
                    },
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "name"}
                                    onClick={sortCallback("name")}
                                    direction={
                                        sortColumn === "name"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "department_name"}
                                    onClick={sortCallback("department_name")}
                                    direction={
                                        sortColumn === "department_name"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    department
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "num_members"}
                                    onClick={sortCallback("num_members")}
                                    direction={
                                        sortColumn === "num_members"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    number of members
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>access</TableCell>
                            {isAdmin ? <TableCell></TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((r) => (
                            <TableRow
                                key={r.id}
                                hover={true}
                                onClick={() => {
                                    navigate(`/roles/${r.id}`);
                                }}
                            >
                                <TableCell>{r.name}</TableCell>
                                <TableCell>{r.department.name}</TableCell>
                                <TableCell>{r.num_members}</TableCell>
                                <TableCell>{r.access}</TableCell>
                                {isAdmin ? (
                                    <TableCell>
                                        {r.access !== "ADMIN" ? (
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
                                        ) : null}
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={count}
                    component="div"
                    page={page}
                    rowsPerPage={limit}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </TableContainer>
            <Confirm
                title="Delete"
                method="DELETE"
                description={`${selected?.name} <${selected?.department.name}>`}
                url={server(`/roles/${selected?.id}`)}
                triggerRefresh={() => setRefresh(true)}
                open={showDelete}
                setAlert={setAlert}
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
            />
            <CreateRole
                departments={departments}
                refresh={() => setRefresh(true)}
                setAlert={setAlert}
                open={showCreate}
                onClose={() => setShowCreate(!showCreate)}
            />
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

export default Roles;
