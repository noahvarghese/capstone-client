import {
    Box,
    Typography,
    Alert,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Assignment from "src/components/Assignment";
import Loading from "src/components/Loading";
import { Role } from "src/context";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";
import DynamicForm from "src/components/DynamicForm";
import DynamicDataTable from "src/components/DynamicDataTable";

const ManualView = () => {
    const { id } = useParams();
    const [manual, setManual] = useState<Manual | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/manuals/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    try {
                        if (res.ok) {
                            const r = await res.json();
                            setManual(r);
                            return;
                        }
                    } catch (e) {
                        const { message } = e as Error;
                        setAlert({
                            message,
                            severity: "error",
                        });
                    }

                    setAlert({
                        message:
                            (await res.text()) ?? "Unable to retrieve manual",
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

    if (!manual) {
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
            <Typography variant="h1">Manual</Typography>
            <Typography variant="h2">{manual.title}</Typography>
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
                        title="Update Manual"
                        triggerRefresh={() => setRefresh(true)}
                        setAlert={setAlert}
                        fetchOptions={{
                            mode: "cors",
                            credentials: "include",
                            method: "PUT",
                        }}
                        url={server(`/manuals/${manual.id}`)}
                        formOptions={{
                            title: {
                                registerOptions: {
                                    required: "title cannot be empty",
                                    disabled: manual.prevent_edit,
                                },
                                type: "input",
                                label: "title",
                                defaultValue: manual.title,
                            },
                            prevent_edit: {
                                registerOptions: {},
                                defaultValue: manual.prevent_edit,
                                type: "checkbox",
                                label: "prevent edit",
                            },
                            prevent_delete: {
                                registerOptions: {
                                    disabled: manual.prevent_edit,
                                },
                                defaultValue: manual.prevent_delete,
                                type: "checkbox",
                                label: "prevent delete",
                            },
                            published: {
                                registerOptions: {
                                    disabled: manual.prevent_edit,
                                },
                                defaultValue: manual.published,
                                type: "checkbox",
                                label: "publish",
                            },
                        }}
                    />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="title"
                                secondary={manual.title}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent edit"
                                secondary={manual.prevent_edit.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent delete"
                                secondary={manual.prevent_delete.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="published"
                                secondary={manual.published.toString()}
                            />
                        </ListItem>
                    </List>
                </Box>
                <DynamicDataTable<{ id: number; title: string }>
                    columns={[{ key: "title", value: "title" }]}
                    deleteUrl={(id?: number) =>
                        server(`/manuals/sections/${id}`)
                    }
                    description={(m) => `${m?.title}`}
                    disableDeleteForTable={manual.prevent_edit}
                    disableForm={manual.prevent_edit}
                    formOptions={{
                        title: {
                            defaultValue: "",
                            label: "title",
                            type: "input",
                            inputType: "text",
                            registerOptions: {
                                required: "title cannot be empty",
                            },
                        },
                    }}
                    getUrl={server(`/manuals/${manual.id}/sections`)}
                    modelName="Section"
                    navigateUrl={(id?: number) =>
                        `/manuals/${manual.id}/sections/${id}`
                    }
                    postUrl={server(`manuals/${manual.id}/sections`)}
                    setAlert={setAlert}
                />
                <DynamicDataTable<{
                    id: number;
                    title: string;
                    max_attempts: number;
                    prevent_edit: boolean;
                    prevent_delete: boolean;
                    published: boolean;
                }>
                    columns={[
                        { key: "title", value: "title" },
                        { key: "max_attempts", value: "max attempts" },
                        { key: "published", value: "published" },
                        { key: "prevent_edit", value: "prevent edit" },
                    ]}
                    deleteUrl={(id?: number) => server(`/quizzes/${id}`)}
                    disableDeleteForRow={(q) => q.prevent_delete}
                    description={(q) => `${q?.title}`}
                    formOptions={{
                        title: {
                            type: "input",
                            defaultValue: "",
                            label: "title",
                            inputType: "text",
                            registerOptions: {
                                required: "title cannot be empty",
                            },
                        },
                        max_attempts: {
                            type: "input",
                            defaultValue: "",
                            label: "max attempts",
                            inputType: "number",
                            registerOptions: {
                                required: "max attempts cannot be empty",
                            },
                        },
                        prevent_edit: {
                            registerOptions: {},
                            defaultValue: false,
                            type: "checkbox",
                            label: "prevent edit",
                        },
                        prevent_delete: {
                            registerOptions: {},
                            defaultValue: false,
                            type: "checkbox",
                            label: "prevent delete",
                        },
                        published: {
                            registerOptions: {},
                            defaultValue: false,
                            type: "checkbox",
                            label: "publish",
                        },
                    }}
                    getUrl={server(`/manuals/${manual.id}/quizzes`)}
                    modelName="Quiz"
                    navigateUrl={(id?: number) => `/quizzes/${id}`}
                    postUrl={server(`/manuals/${manual.id}/quizzes`)}
                    setAlert={setAlert}
                />
                <Assignment
                    modelName="roles"
                    hideCondition={() => true}
                    allURL={`${server("/roles")}`}
                    assignedURL={server(`/manuals/${manual.id}/roles`)}
                    assignmentURL={(r?: Role) =>
                        `${server(`/manuals/${manual.id}/roles/${r?.id}`)}`
                    }
                    description={(r: Role) =>
                        `${r.name} <${r.department.name}>`
                    }
                    assignmentDescription={(r?: Role) =>
                        `manual ${manual.title} to role: ${r?.name} <${r?.department.name}>`
                    }
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

export default ManualView;
