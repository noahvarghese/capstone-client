import { Alert, Box, MenuItem, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import DisplayCard from "src/components/DisplayCard";
import AppContext from "src/context";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";

const UserManualsList = () => {
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [refresh, setRefresh] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<number | undefined>();
    const [filterField, setFilterField] = useState<
        "department" | "role" | undefined
    >();
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const { roles } = useContext(AppContext);

    const departments = useMemo(() => roles.map((r) => r.department), [roles]);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(
                server(
                    `/manuals?${
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
                        const { data } = await res.json();
                        setManuals(data);
                        return;
                    }

                    setAlert({
                        message:
                            (await res.text()) ?? "Unable to retrieve manuals",
                        severity: "error",
                    });
                })
                .catch((e) =>
                    setAlert({
                        message: (e as Error).message,
                        severity: "error",
                    })
                )
                .finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [filter, filterField, refresh, search]);

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
            <Typography variant="h1">Manuals</Typography>
            <Box
                style={{
                    margin: "2rem 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
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
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "2rem",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                    }}
                >
                    {manuals.map((m) => (
                        <DisplayCard
                            title={m.title}
                            url={`/manuals/${m.id}`}
                            key={`manual${m.id}`}
                        />
                    ))}
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

export default UserManualsList;
