import {
    Typography,
    Box,
    Alert,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Assignment from "src/components/Assignment";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import AppContext, { Member, Role } from "src/context";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";

const RoleView: React.FC = () => {
    const { userId, roles } = useContext(AppContext);

    const isAdmin = useMemo(
        () => roles.find((r) => r.access === "ADMIN"),
        [roles]
    );

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
                    <DynamicForm
                        disableSubmit={role.access === "ADMIN"}
                        title="Update Role"
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        setAlert={setAlert}
                        url={server(`/roles/${role.id}`)}
                        triggerRefresh={() => setRefresh(true)}
                        formOptions={{
                            name: {
                                defaultValue: role.name,
                                label: "name",
                                type: "input",
                                inputType: "text",
                                registerOptions: {
                                    required: "name cannot be empty",
                                    disabled:
                                        role.access === "ADMIN" || !isAdmin,
                                },
                            },
                            access: {
                                defaultValue: role.access,
                                label: "access",
                                type: "select",
                                items: [
                                    role.access === "ADMIN"
                                        ? { key: "ADMIN", value: "ADMIN" }
                                        : undefined,
                                    { key: "MANAGER", value: "MANAGER" },
                                    { key: "USER", value: "USER" },
                                ].filter((v) => v !== undefined) as {
                                    key: string;
                                    value: string;
                                }[],
                                registerOptions: {
                                    required: "access cannot be empty",
                                    disabled:
                                        role.access === "ADMIN" || !isAdmin,
                                },
                            },
                        }}
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
