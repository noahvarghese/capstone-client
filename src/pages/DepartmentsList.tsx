import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
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
import { useHistory } from "react-router-dom";
import useSort from "src/hooks/useSort";
import usePagination from "src/hooks/usePagination";
import Confirm from "src/components/Confirmation";

const CreateDepartment: React.FC<{
    refresh: () => void;
    open: boolean;
    onClose: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ open, refresh, onClose, setAlert }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all", defaultValues: { name: "" } });

    const close = useCallback(() => {
        reset({ name: "" });
        onClose();
    }, [onClose, reset]);

    const submit = useCallback(
        async (data) => {
            await fetch(server("/departments"), {
                body: JSON.stringify(data),
                method: "POST",
                credentials: "include",
            }).then(async (res) => {
                if (res.ok) {
                    refresh();
                    setAlert({
                        message: "Success",
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: "Unable to create department",
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
                        type="name"
                        value={watch("name", "")}
                        placeholder="name"
                        required
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

const Departments = () => {
    const { roles } = useContext(AppContext);
    const history = useHistory();
    const [search, setSearch] = useState("");
    const [refresh, setRefresh] = useState(true);
    const [selected, setSelected] = useState<Department | undefined>();
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [departments, setDepartments] = useState<
        (Department & Partial<{ roles: Role[] }>)[]
    >([]);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });
    const { sortCallback, sortColumn, sortOrder } = useSort(() =>
        setRefresh(true)
    );
    const [count, setCount] = useState(0);
    const { page, limit, onPageChange, onRowsPerPageChange } = usePagination(
        5,
        () => setRefresh(true)
    );

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();
            const fetchOptions: RequestInit = {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            };

            fetch(
                server(
                    `/departments/?page=${page + 1}&limit=${limit}${
                        sortColumn
                            ? `&sort_field=${sortColumn}&sort_order=${sortOrder.toUpperCase()}`
                            : ""
                    }${search ? `&search=${search}` : ""}`
                ),
                fetchOptions
            )
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            const { data, count } = await res.json();

                            const departments = await Promise.all(
                                data.map((d: Department) =>
                                    fetch(
                                        server(`/departments/${d.id}/roles`),
                                        fetchOptions
                                    )
                                        .then((result) => result.json())
                                        .then((r) => ({
                                            ...d,
                                            roles: r,
                                        }))
                                )
                            );
                            setDepartments(departments);
                            setCount(count);
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message:
                            (await res.text()) ??
                            "Unable to retrieve departments",
                        severity: "error",
                    });
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                })
                .finally(() => {
                    setRefresh(false);
                });

            return () => {
                controller.abort();
            };
        }
    }, [refresh, page, limit, sortColumn, sortOrder, search]);

    const isAdmin = useMemo(
        () => roles.find((r) => r.access === "ADMIN"),
        [roles]
    );

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
            <Typography variant="h1">Departments</Typography>
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
                {isAdmin ? (
                    <Fab color="primary" onClick={() => setShowCreate(true)}>
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
                                    direction={
                                        sortColumn === "name"
                                            ? sortOrder
                                            : "asc"
                                    }
                                    onClick={sortCallback("name")}
                                >
                                    name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "num_managers"}
                                    direction={
                                        sortColumn === "num_managers"
                                            ? sortOrder
                                            : "asc"
                                    }
                                    onClick={sortCallback("num_managers")}
                                >
                                    number of managers
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "num_members"}
                                    direction={
                                        sortColumn === "num_members"
                                            ? sortOrder
                                            : "asc"
                                    }
                                    onClick={sortCallback("num_members")}
                                >
                                    number of members
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "num_roles"}
                                    direction={
                                        sortColumn === "num_roles"
                                            ? sortOrder
                                            : "asc"
                                    }
                                    onClick={sortCallback("num_roles")}
                                >
                                    number of roles
                                </TableSortLabel>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map(
                            (d: Department & Partial<{ roles: Role[] }>) => {
                                const hasAdminRole =
                                    d.roles?.find(
                                        (r) => r.access === "ADMIN"
                                    ) !== undefined;

                                return (
                                    <TableRow
                                        key={d.id}
                                        hover={true}
                                        onClick={() => {
                                            setSelected(d);
                                            history.push(
                                                `/departments/${d.id}`
                                            );
                                        }}
                                    >
                                        <TableCell>{d.name}</TableCell>
                                        <TableCell>{d.num_managers}</TableCell>
                                        <TableCell>{d.num_members}</TableCell>
                                        <TableCell>{d.num_roles}</TableCell>
                                        <TableCell>
                                            {!hasAdminRole && isAdmin ? (
                                                <Button
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelected(d);
                                                        setShowDelete(true);
                                                    }}
                                                >
                                                    <Delete />
                                                </Button>
                                            ) : null}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
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
                method="DELETE"
                title="Delete"
                url={server(`/departments/${selected?.id}`)}
                description={`${selected?.name}`}
                open={showDelete}
                setAlert={setAlert}
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
                triggerRefresh={() => setRefresh(true)}
            />
            <CreateDepartment
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

export default Departments;
