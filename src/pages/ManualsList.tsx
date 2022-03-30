import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    FormControlLabel,
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
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router";
import { server } from "src/util/permalink";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import usePagination from "src/hooks/usePagination";
import useSort from "src/hooks/useSort";
import useRoles from "src/hooks/data/useRoles";
import useDepartments from "src/hooks/data/useDepartments";
import Confirm from "src/components/Confirmation";

export type Manual = {
    id: number;
    title: string;
    published: boolean;
    prevent_edit: boolean;
    prevent_delete: boolean;
};

const CreateManual: React.FC<{
    open: boolean;
    triggerRefresh: () => void;
    onClose: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ open, onClose, setAlert, triggerRefresh }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: {
            title: "",
            prevent_edit: false,
            prevent_delete: false,
            published: false,
        },
    });

    const close = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const submit = useCallback(
        async (data) => {
            await fetch(server("/manuals"), {
                body: JSON.stringify({
                    ...data,
                    prevent_edit:
                        typeof data.prevent_edit === "string"
                            ? Boolean(data.prevent_edit)
                            : false,
                    prevent_delete:
                        typeof data.prevent_delete === "string"
                            ? Boolean(data.prevent_delete)
                            : false,
                    published:
                        typeof data.published === "string"
                            ? Boolean(data.published)
                            : false,
                }),
                method: "POST",
                credentials: "include",
                mode: "cors",
            }).then(async (res) => {
                if (res.ok) {
                    triggerRefresh();
                    setAlert({
                        message: `Created manual: ${data.title}`,
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: `Unable to create manual: ${data.title}`,
                        severity: "error",
                    });
                }
                close();
            });
        },
        [close, setAlert, triggerRefresh]
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
                        {...register("title", {
                            required: "title cannot be empty",
                        })}
                        id="title"
                        placeholder="title"
                        type="text"
                        error={Boolean(errors.title)}
                        helperText={errors.title?.message}
                        label="title"
                        value={watch("title", "")}
                        required
                        disabled={isSubmitting}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register("prevent_edit")}
                                value={true}
                                checked={Boolean(watch("prevent_edit"))}
                            />
                        }
                        label="prevent edit"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register("prevent_delete")}
                                checked={Boolean(watch("prevent_delete"))}
                                value={true}
                            />
                        }
                        label="prevent delete"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register("published")}
                                value={true}
                                checked={Boolean(watch("published"))}
                            />
                        }
                        label="publish"
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

const Manuals = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<Manual | undefined>();
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [refresh, setRefresh] = useState(true);
    const [search, setSearch] = useState("");
    const { sortOrder, sortColumn, sortCallback } = useSort(() =>
        setRefresh(true)
    );
    const { page, limit, onPageChange, onRowsPerPageChange } = usePagination(
        5,
        () => setRefresh(true)
    );
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState<number | undefined>();
    const [filterField, setFilterField] = useState<
        "department" | "role" | undefined
    >();
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });
    const roles = useRoles(setAlert);
    const departments = useDepartments(setAlert);
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(
                server(
                    `/manuals?page=${page + 1}&limit=${limit}${
                        sortColumn
                            ? `&sort_field=${sortColumn}&sort_order=${sortOrder.toUpperCase()}`
                            : ""
                    }${
                        filter
                            ? `&filter_field=${filterField}&filter_ids=${JSON.stringify(
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
                            setManuals(data.data);
                            setCount(data.count);
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message: "Unable to retrieve manuals",
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
    }, [
        filter,
        filterField,
        limit,
        page,
        refresh,
        search,
        sortColumn,
        sortOrder,
    ]);

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
            <Typography variant="h1">Manuals</Typography>
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
                        label="filter by department assigned"
                        id="department"
                        value={
                            filterField === "department" && filter && filter > 0
                                ? filter
                                : ""
                        }
                        placeholder="department"
                        style={{ width: "15rem" }}
                        onChange={(e) => {
                            const id =
                                e.target.value === undefined
                                    ? undefined
                                    : Number(e.target.value);
                            if (filterField !== "department")
                                setFilterField("department");
                            setFilter(id);
                            setRefresh(true);
                        }}
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
                    <TextField
                        select
                        label="filter by role assigned"
                        id="role"
                        placeholder="role"
                        style={{ width: "15rem" }}
                        value={
                            filterField === "role" && filter && filter > 0
                                ? filter
                                : ""
                        }
                        onChange={(e) => {
                            const id =
                                e.target.value === undefined
                                    ? undefined
                                    : Number(e.target.value);
                            if (filterField !== "role") setFilterField("role");
                            setFilter(id);
                            setRefresh(true);
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name} {`<${r.department.name}>`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Fab color="primary" onClick={() => setShowCreate(true)}>
                    <AddIcon />
                </Fab>
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
                                    active={sortColumn === "title"}
                                    direction={
                                        sortColumn === "title"
                                            ? sortOrder
                                            : "asc"
                                    }
                                    onClick={sortCallback("title")}
                                >
                                    title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>published</TableCell>
                            <TableCell>editable</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {manuals.map((m) => (
                            <TableRow
                                key={m.id}
                                hover={true}
                                onClick={() => {
                                    navigate(`/manuals/${m.id}`);
                                }}
                            >
                                <TableCell>{m.title}</TableCell>
                                <TableCell>{m.published.toString()}</TableCell>
                                <TableCell>
                                    {m.prevent_edit.toString()}
                                </TableCell>
                                <TableCell>
                                    {!m.prevent_delete ? (
                                        <Button
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(m);
                                                setShowDelete(true);
                                            }}
                                        >
                                            <Delete />
                                        </Button>
                                    ) : null}
                                </TableCell>
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
            <CreateManual
                triggerRefresh={() => setRefresh(true)}
                open={showCreate}
                setAlert={setAlert}
                onClose={() => setShowCreate(false)}
            />
            <Confirm
                method="DELETE"
                title="Delete"
                description={`${selected?.title}`}
                url={server(`/manuals/${selected?.id}`)}
                setAlert={setAlert}
                triggerRefresh={() => setRefresh(true)}
                open={showDelete}
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
            />
        </div>
    );
};

export default Manuals;
