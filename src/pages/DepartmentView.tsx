import {
    Box,
    Typography,
    Alert,
    ListItem,
    List,
    ListItemText,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import AppContext, { Department, Role } from "src/context";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import DynamicForm from "src/components/DynamicForm";
import DynamicDataTable from "src/components/DynamicDataTable";
import { genItems } from "src/util/questionTypes";

const DepartmentView: React.FC = () => {
    const { roles } = useContext(AppContext);
    const { id } = useParams<{ id?: string }>();
    const [department, setDepartment] = useState<
        (Department & Partial<{ roles: Role[] }>) | undefined
    >();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const isAdmin = useMemo(
        () => roles.find((r) => r.access === "ADMIN"),
        [roles]
    );

    useEffect(() => {
        if (department) {
            const controller = new AbortController();

            return () => {
                controller.abort();
            };
        }
    }, [department]);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();
            const fetchOptions: RequestInit = {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            };

            fetch(server(`/departments/${id}`), fetchOptions)
                .then((res) => res.json())
                .then((d) =>
                    fetch(server(`/departments/${d.id}/roles`), fetchOptions)
                        .then((res) => res.json())
                        .then((r) => ({ ...d, roles: r }))
                        .then(setDepartment)
                )
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
                    <DynamicForm
                        title="Update Department"
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        setAlert={setAlert}
                        url={server(`/departments/${department.id}`)}
                        disableSubmit={
                            department.roles?.find(
                                (r) => r.access === "ADMIN"
                            ) !== undefined || !isAdmin
                        }
                        titleVariant="h5"
                        triggerRefresh={() => setRefresh(true)}
                        formOptions={{
                            name: {
                                defaultValue: department.name,
                                input: {
                                    label: "name",
                                },
                                registerOptions: {
                                    required: "name cannot be empty",
                                },
                            },
                        }}
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
                <DynamicDataTable<Role>
                    columns={[
                        { key: "name", value: "name" },
                        { key: "access", value: "access" },
                        { key: "num_members", value: "number of members" },
                    ]}
                    deleteUrl={(id?: number) => server(`/roles/${id}`)}
                    description={(r?) => `${r?.name}`}
                    disableDeleteForRow={(r: Role) => r.access === "ADMIN"}
                    formOptions={{
                        name: {
                            defaultValue: "",
                            input: {
                                label: "name",
                            },
                            registerOptions: {
                                required: "name cannot be empty",
                            },
                        },
                        access: {
                            defaultValue: "",
                            select: {
                                items: genItems(["USER", "MANAGER"]),
                                label: "access",
                            },
                            registerOptions: {
                                required: "access cannot be empty",
                            },
                        },
                        department_id: {
                            defaultValue: department.id,
                            hidden: {
                                disabled: true,
                                value: department.id,
                                label: "department id",
                            },
                            registerOptions: { valueAsNumber: true },
                        },
                    }}
                    getUrl={server(`/departments/${department.id}/roles`)}
                    modelName="Role"
                    navigateUrl={(id) => `/roles/${id}`}
                    postUrl={server("/roles")}
                    setAlert={setAlert}
                />
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
