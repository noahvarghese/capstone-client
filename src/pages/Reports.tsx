import {
    Box,
    Typography,
    Tab,
    Tabs,
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
    MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BarChart from "src/components/graphs/BarChart";
import PieChart from "src/components/graphs/PieChart";
import { Department, Member, Role } from "src/context";
import usePagination from "src/hooks/usePagination";
import useSort from "src/hooks/useSort";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";
import { Quiz } from "./QuizzesList";

interface TabProps {
    index: number;
    active: number;
}

const Charts: React.FC<TabProps> = ({ active, index }) => {
    const [quizAttempts, setQuizAttempts] = useState<{
        role_details: { id: number; name: string; total_attempts: number }[];
        department_details: {
            id: number;
            name: string;
            total_attempts: number;
        }[];
    }>();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchOptions: RequestInit = {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        };

        Promise.all([
            fetch(server("/reports/quizzes/attempts"), fetchOptions)
                .then((res) => res.json())
                .then(setQuizAttempts),
            fetch(server("/departments"), fetchOptions)
                .then((res) => res.json())
                .then(({ data }) => data)
                .then(setDepartments),
            fetch(server("/roles"), fetchOptions)
                .then((res) => res.json())
                .then(({ data }) => data)
                .then(setRoles),
        ]);

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <div
            hidden={active !== index}
            style={{
                display: active === index ? "flex" : "none",
                width: "100%",
                maxWidth: "95vw",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                gap: "5rem",
            }}
        >
            <PieChart
                title="Number of attempts at quizzes per role"
                data={
                    quizAttempts
                        ? quizAttempts.role_details.map((r) => ({
                              name: r.name,
                              value: r.total_attempts,
                          }))
                        : []
                }
            />
            <PieChart
                title="Number of attempts at quizzes per department"
                data={
                    quizAttempts
                        ? quizAttempts.department_details.map((d) => ({
                              name: d.name,
                              value: d.total_attempts,
                          }))
                        : []
                }
            />
            <BarChart
                title="Number of employees per department"
                data={departments.map((d) => ({
                    name: d.name,
                    value: d.num_members,
                }))}
            />
            <BarChart
                title="Number of employees per role"
                data={roles.map((r) => ({
                    name: r.name,
                    value: r.num_members,
                }))}
            />
            <BarChart
                title="Number of managers per department"
                data={departments.map((d) => ({
                    name: d.name,
                    value: d.num_managers,
                }))}
            />
        </div>
    );
};

const QuizReport: React.FC<TabProps> = ({ active, index }) => {
    // TODO: Open modal showing list of user's attempts per quiz with scores - allow delete
    const [memberQuizzes, setMemberQuizzes] = useState<
        {
            user_id: number;
            first_name: string;
            last_name: string;
            title: string;
            quiz_id: number;
            number_of_attempts: number;
        }[]
    >([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [refresh, setRefresh] = useState(true);
    const [filter, setFilter] = useState<number | undefined>();
    const [complete, setComplete] = useState<boolean | undefined>();
    const [search, setSearch] = useState("");
    const [filterField, setFilterField] = useState<
        "user" | "quiz" | undefined
    >();
    const [count, setCount] = useState(0);
    const { sortCallback, sortColumn, sortOrder } = useSort(() =>
        setRefresh(true)
    );
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

            Promise.all([
                fetch(
                    server(
                        `/reports/quizzes/?page=${page + 1}&limit=${limit}${
                            sortColumn
                                ? `&sort_field=${sortColumn}&sort_order=${sortOrder.toUpperCase()}`
                                : ""
                        }${
                            filter
                                ? `&filter_field=${filterField}&filter_ids=${JSON.stringify(
                                      [filter]
                                  )}`
                                : ""
                        }${search ? `&search=${search}` : ""}${
                            complete !== undefined
                                ? `&complete=${complete.toString()}`
                                : ""
                        }`
                    ),
                    fetchOptions
                )
                    .then((res) => res.json())
                    .then(({ data, count: numberOfEntries }) => {
                        setMemberQuizzes(data);
                        setCount(numberOfEntries);
                    }),
                fetch(server("/members"), fetchOptions)
                    .then((res) => res.json())
                    .then(({ data }) => data)
                    .then(setMembers),
                fetch(server("/quizzes"), fetchOptions)
                    .then((res) => res.json())
                    .then(({ data }) => data)
                    .then(setQuizzes),
            ]).finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [
        complete,
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
        <Box
            style={{
                display: index === active ? "flex" : "none",
                minHeight: 400,
                width: "100%",
                gap: "2rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
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
                <TextField
                    select
                    label="filter by member"
                    id="department"
                    value={
                        filterField === "user" && filter && filter > 0
                            ? filter
                            : ""
                    }
                    placeholder="member"
                    style={{ width: "15rem" }}
                    onChange={(e) => {
                        const id =
                            e.target.value === undefined
                                ? undefined
                                : Number(e.target.value);
                        if (filterField !== "user") setFilterField("user");
                        setFilter(id);
                        setRefresh(true);
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {members.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                            {m.first_name} {m.last_name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="filter by quiz"
                    id="manual"
                    placeholder="manual"
                    style={{ width: "15rem" }}
                    value={
                        filterField === "quiz" && filter && filter > 0
                            ? filter
                            : ""
                    }
                    onChange={(e) => {
                        const id =
                            e.target.value === undefined
                                ? undefined
                                : Number(e.target.value);
                        if (filterField !== "quiz") setFilterField("quiz");
                        setFilter(id);
                        setRefresh(true);
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {quizzes.map((q) => (
                        <MenuItem key={q.id} value={q.id}>
                            {q.title}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="filter by complete"
                    id="read"
                    value={complete === undefined ? "" : complete ? 1 : 0}
                    placeholder="read"
                    style={{ width: "15rem" }}
                    onChange={(e) => {
                        setComplete(
                            e.target.value !== ""
                                ? Number(e.target.value) === 1
                                : undefined
                        );
                        setRefresh(true);
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={0}>Incomplete</MenuItem>
                    <MenuItem value={1}>Complete</MenuItem>
                </TextField>
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
                    margin: "0 auto",
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
                                    active={sortColumn === "title"}
                                    onClick={sortCallback("title")}
                                    direction={
                                        sortColumn === "title"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    quiz
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>complete</TableCell>
                            <TableCell>attempts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {memberQuizzes.map((m) => {
                            return (
                                <TableRow
                                    key={`user${m.user_id}manual${m.quiz_id}`}
                                    hover={true}
                                    onClick={() => {
                                        // history.push(`/members/${m.id}`);
                                    }}
                                >
                                    <TableCell>{m.first_name}</TableCell>
                                    <TableCell>{m.last_name}</TableCell>
                                    <TableCell>{m.title}</TableCell>
                                    <TableCell>
                                        {(m.number_of_attempts > 0).toString()}
                                    </TableCell>
                                    <TableCell>
                                        {m.number_of_attempts}
                                    </TableCell>
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
        </Box>
    );
};

const ManualReport: React.FC<TabProps> = ({ active, index }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [membersAndManuals, setMembersAndManuals] = useState<
        {
            user_id: number;
            first_name: string;
            last_name: string;
            manual_id: number;
            read: boolean;
            title: string;
            total_contents: number;
            contents_read: number;
        }[]
    >([]);
    const [refresh, setRefresh] = useState(true);
    const [filter, setFilter] = useState<number | undefined>();
    const [read, setRead] = useState<boolean | undefined>();
    const [search, setSearch] = useState("");
    const [filterField, setFilterField] = useState<
        "user" | "manual" | undefined
    >();
    const [count, setCount] = useState(0);
    const { sortCallback, sortColumn, sortOrder } = useSort(() =>
        setRefresh(true)
    );
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

            Promise.all([
                fetch(
                    server(
                        `/reports/manuals/?page=${page + 1}&limit=${limit}${
                            sortColumn
                                ? `&sort_field=${sortColumn}&sort_order=${sortOrder.toUpperCase()}`
                                : ""
                        }${
                            filter
                                ? `&filter_field=${filterField}&filter_ids=${JSON.stringify(
                                      [filter]
                                  )}`
                                : ""
                        }${search ? `&search=${search}` : ""}${
                            read !== undefined ? `&read=${read.toString()}` : ""
                        }`
                    ),
                    fetchOptions
                )
                    .then((res) => res.json())
                    .then(({ data, count: numberOfEntries }) => {
                        setMembersAndManuals(data);
                        setCount(numberOfEntries);
                    }),
                fetch(server("/members"), fetchOptions)
                    .then((res) => res.json())
                    .then(({ data }) => data)
                    .then(setMembers),
                fetch(server("/manuals"), fetchOptions)
                    .then((res) => res.json())
                    .then(({ data }) => data)
                    .then(setManuals),
            ]).finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [
        filter,
        filterField,
        limit,
        page,
        read,
        refresh,
        search,
        sortColumn,
        sortOrder,
    ]);

    return (
        <Box
            style={{
                display: index === active ? "flex" : "none",
                minHeight: 400,
                width: "100%",
                gap: "2rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
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
                <TextField
                    select
                    label="filter by member"
                    id="department"
                    value={
                        filterField === "user" && filter && filter > 0
                            ? filter
                            : ""
                    }
                    placeholder="member"
                    style={{ width: "15rem" }}
                    onChange={(e) => {
                        const id =
                            e.target.value === undefined
                                ? undefined
                                : Number(e.target.value);
                        if (filterField !== "user") setFilterField("user");
                        setFilter(id);
                        setRefresh(true);
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {members.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                            {m.first_name} {m.last_name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="filter by manual"
                    id="manual"
                    placeholder="manual"
                    style={{ width: "15rem" }}
                    value={
                        filterField === "manual" && filter && filter > 0
                            ? filter
                            : ""
                    }
                    onChange={(e) => {
                        const id =
                            e.target.value === undefined
                                ? undefined
                                : Number(e.target.value);
                        if (filterField !== "manual") setFilterField("manual");
                        setFilter(id);
                        setRefresh(true);
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {manuals.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                            {m.title}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="filter by read"
                    id="read"
                    value={read === undefined ? "" : read ? 1 : 0}
                    placeholder="read"
                    style={{ width: "15rem" }}
                    onChange={(e) => {
                        setRead(
                            e.target.value !== ""
                                ? Number(e.target.value) === 1
                                : undefined
                        );
                        setRefresh(true);
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={0}>Unread</MenuItem>
                    <MenuItem value={1}>Read</MenuItem>
                </TextField>
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
                    margin: "0 auto",
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
                                    active={sortColumn === "title"}
                                    onClick={sortCallback("title")}
                                    direction={
                                        sortColumn === "title"
                                            ? sortOrder
                                            : "asc"
                                    }
                                >
                                    manual
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>read</TableCell>
                            <TableCell>contents read</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {membersAndManuals.map((m) => {
                            return (
                                <TableRow
                                    key={`user${m.user_id}manual${m.manual_id}`}
                                >
                                    <TableCell>{m.first_name}</TableCell>
                                    <TableCell>{m.last_name}</TableCell>
                                    <TableCell>{m.title}</TableCell>
                                    <TableCell>
                                        {(
                                            m.contents_read === m.total_contents
                                        ).toString()}
                                    </TableCell>
                                    <TableCell>{`${m.contents_read}/${m.total_contents}`}</TableCell>
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
        </Box>
    );
};

const Reports: React.FC = () => {
    const [active, setActive] = useState(0);

    const handleChange = (_: React.ChangeEvent<unknown>, index: number) => {
        setActive(index);
    };

    return (
        <div
            style={{
                minHeight: 400,
                width: "100%",
                maxWidth: "95vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "5rem",
                margin: "0 2vw",
            }}
        >
            <Typography variant="h1">Reports</Typography>

            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5rem",
                    width: "100%",
                }}
            >
                <Tabs
                    value={active}
                    onChange={handleChange}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons
                    aria-label="scrollable tabs"
                    style={{ maxWidth: "95vw" }}
                >
                    <Tab label="Charts" />
                    <Tab label="Manuals" />
                    <Tab label="Quizzes" />
                </Tabs>
                <Box
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Charts index={0} active={active} />
                    <ManualReport index={1} active={active} />
                    <QuizReport index={2} active={active} />
                </Box>
            </Box>
        </div>
    );
};

export default Reports;
