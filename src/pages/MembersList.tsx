import React, {
    Dispatch,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Paper,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Table,
    TextField,
    Typography,
    TableBody,
    TablePagination,
    MenuItem,
} from "@mui/material";
import AppContext, { Member } from "src/context";
import AddIcon from "@mui/icons-material/Add";
import { server } from "src/util/permalink";
import { useForm } from "react-hook-form";
import validator from "validator";
import { phoneValidator } from "src/util/validators";
import { SetStateAction } from "react";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router";
import useRoles from "src/hooks/data/useRoles";
import useDepartments from "src/hooks/data/useDepartments";
import useSort from "src/hooks/useSort";
import usePagination from "src/hooks/usePagination";
import Confirm from "src/components/Confirmation";

const InviteMember: React.FC<{
    open: boolean;
    refresh: () => void;
    onClose: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ open, onClose, setAlert, refresh }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all", defaultValues: { email: "", phone: "" } });

    const close = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const submit = useCallback(
        async (data) => {
            await fetch(server("/members/invite"), {
                body: JSON.stringify(data),
                method: "POST",
                credentials: "include",
            }).then(async (res) => {
                if (res.ok) {
                    setAlert({
                        message: `Sent invitation to: ${data.email}`,
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: `Unable to invite user ${data.email}`,
                        severity: "error",
                    });
                }
                refresh();
                close();
            });
        },
        [close, refresh, setAlert]
    );

    return (
        <Dialog open={open} onClose={close} keepMounted={false}>
            <DialogTitle>Invite</DialogTitle>
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
                        {...register("email", {
                            required: "email cannot be empty",
                            validate: (val: string) =>
                                validator.isEmail(val) || "invalid email",
                        })}
                        label="email"
                        id="email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        autoComplete="email"
                        type="email"
                        value={watch("email", "")}
                        placeholder="email"
                        required
                        disabled={isSubmitting}
                    />
                    <TextField
                        {...register("phone", {
                            validate: (v) => {
                                if (!v) return true;
                                return phoneValidator(v);
                            },
                        })}
                        id="phone"
                        value={watch("phone", "")}
                        error={Boolean(errors.phone)}
                        helperText={errors.phone?.message}
                        label="phone"
                        autoComplete="tel"
                        type="tel"
                        placeholder="phone"
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
                            Invite
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Members: React.FC = () => {
    const navigate = useNavigate();
    const { roles: userRoles } = useContext(AppContext);
    const [selected, setSelected] = useState<Member | undefined>();
    const [refresh, setRefresh] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [filter, setFilter] = useState<number | undefined>();
    const [search, setSearch] = useState("");
    const [filterField, setFilterField] = useState<
        "department" | "role" | undefined
    >();
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });
    const roles = useRoles(setAlert);
    const departments = useDepartments(setAlert);
    const [count, setCount] = useState(0);
    const { sortCallback, sortColumn, sortOrder } = useSort(() =>
        setRefresh(true)
    );
    const { page, limit, onPageChange, onRowsPerPageChange } = usePagination(
        5,
        () => setRefresh(true)
    );

    useEffect(() => {
        if (members.length === 0 || refresh) {
            fetch(
                server(
                    `/members/?page=${page + 1}&limit=${limit}${
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
                }
            )
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            const data = await res.json();
                            setMembers(
                                data.data.map((d: Record<string, string>) => ({
                                    ...d,
                                    birthday: d.birthday
                                        ? new Date(Date.parse(d.birthday))
                                        : "",
                                }))
                            );
                            setCount(data.count);
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message: "Unable to retrieve members",
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
        }
    }, [
        filter,
        filterField,
        limit,
        members.length,
        page,
        refresh,
        search,
        sortColumn,
        sortOrder,
    ]);

    const isAdmin = useMemo(
        () => userRoles.find((r) => r.access === "ADMIN") !== undefined,
        [userRoles]
    );

    return (
        <div
            className="Members"
            style={{
                minHeight: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h1">Members</Typography>
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
                        label="filter by role"
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
                                    active={sortColumn === "first_name"}
                                    direction={
                                        sortColumn === "first_name"
                                            ? sortOrder
                                            : "asc"
                                    }
                                    onClick={sortCallback("first_name")}
                                >
                                    first name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "last_name"}
                                    onClick={sortCallback("last_name")}
                                    direction={
                                        sortColumn === "last_name"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    last name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "email"}
                                    onClick={sortCallback("email")}
                                    direction={
                                        sortColumn === "email"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "phone"}
                                    onClick={sortCallback("phone")}
                                    direction={
                                        sortColumn === "phone"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    phone
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === "birthday"}
                                    onClick={sortCallback("birthday")}
                                    direction={
                                        sortColumn === "birthday"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    birthday
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>membership accepted</TableCell>
                            {isAdmin ? <TableCell></TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((m) => {
                            const month = m.birthday
                                ? (m.birthday.getMonth() + 1).toString()
                                : "";
                            const date = m.birthday
                                ? m.birthday.getDate().toString()
                                : "";
                            const year = m.birthday
                                ? m.birthday.getFullYear().toString()
                                : "";

                            const birthday = m.birthday
                                ? `${
                                      month.length === 1 ? `0${month}` : month
                                  }/${
                                      date.length === 1 ? `0${date}` : date
                                  }/${year}`
                                : "";

                            return (
                                <TableRow
                                    key={m.id}
                                    hover={true}
                                    onClick={() => {
                                        navigate(`/members/${m.id}`);
                                    }}
                                >
                                    <TableCell>{m.first_name}</TableCell>
                                    <TableCell>{m.last_name}</TableCell>
                                    <TableCell>{m.email}</TableCell>
                                    <TableCell>{m.phone}</TableCell>
                                    <TableCell>{birthday}</TableCell>
                                    <TableCell>
                                        {m.accepted.toString()}
                                    </TableCell>
                                    {isAdmin ? (
                                        <TableCell>
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
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            );
                        })}
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
            <Confirm
                method="DELETE"
                title="Delete"
                url={server(`/members/${selected?.id}`)}
                description={`${selected?.first_name} ${selected?.last_name} <${selected?.email}>`}
                toggleRefresh={() => setRefresh(true)}
                open={showDelete}
                setAlert={setAlert}
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
            />
            <InviteMember
                refresh={() => setRefresh(true)}
                open={showCreate}
                setAlert={setAlert}
                onClose={() => setShowCreate(!showCreate)}
            />
        </div>
    );
};

export default Members;
