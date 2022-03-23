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
import AppContext, { Department } from "src/context";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import DynamicForm from "src/components/DynamicForm";
import DynamicDataTable from "src/components/DynamicDataTable";

const DepartmentView: React.FC = () => {
    const { roles } = useContext(AppContext);
    const { id } = useParams();
    const [department, setDepartment] = useState<Department | undefined>();
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
                    <DynamicForm
                        title="Update Department"
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        setAlert={setAlert}
                        url={server(`/departments/${department.id}`)}
                        disableSubmit={!isAdmin}
                        titleVariant="h5"
                        triggerRefresh={() => setRefresh(true)}
                        formOptions={{
                            name: {
                                defaultValue: department.name,
                                type: "input",
                                label: "name",
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
                <DynamicDataTable<{
                    id: number;
                    name: string;
                    access: "ADMIN" | "MANAGER" | "USER";
                    num_members: number;
                }>
                    columns={[
                        { key: "name", value: "name" },
                        { key: "access", value: "access" },
                        { key: "num_members", value: "number of members" },
                    ]}
                    deleteUrl={(id?: number) => server(`/roles/${id}`)}
                    description={(r?) => `${r?.name}`}
                    formOptions={{
                        name: {
                            defaultValue: "",
                            label: "name",
                            type: "input",
                            registerOptions: {
                                required: "name cannot be empty",
                            },
                        },
                        access: {
                            defaultValue: "",
                            type: "select",
                            items: [
                                { key: "MANAGER", value: "MANAGER" },
                                { key: "USER", value: "USER" },
                            ],
                            label: "access",
                            registerOptions: {
                                required: "access cannot be empty",
                            },
                        },
                        department_id: {
                            defaultValue: department.id,
                            type: "hidden",
                            inputType: "number",
                            label: "department id",
                            registerOptions: { valueAsNumber: true },
                        },
                    }}
                    getUrl={server(`/departments/${department.id}/roles`)}
                    modelName="Role"
                    navigateUrl={(id) => server(`/roles/${id}`)}
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
