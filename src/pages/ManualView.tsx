import {
    Box,
    Typography,
    Alert,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Assignment from "src/components/Assignment";
import Loading from "src/components/Loading";
import { Role } from "src/context";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";
import { Delete } from "@mui/icons-material";
import Confirm from "src/components/Confirmation";
import { Quiz } from "./QuizzesList";
import SectionDisplay from "src/components/Section";
import DynamicForm from "src/components/DynamicForm";

const ManualQuizzes: React.FC<{
    manual: Manual;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ manual, setAlert }) => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(true);
    const [selected, setSelected] = useState<Quiz | undefined>();
    const [showDelete, setShowDelete] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/manuals/${manual.id}/quizzes`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            setQuizzes(await res.json());
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message: "Unable to load roles",
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
    }, [manual.id, refresh, setAlert]);

    return (
        <Box>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Quizzes
            </Typography>
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
                }}
            >
                <DynamicForm
                    resetOnSubmit={true}
                    title="Add Quiz"
                    fetchOptions={{
                        method: "POST",
                        credentials: "include",
                        mode: "cors",
                    }}
                    setAlert={setAlert}
                    url={server(`/manuals/${manual.id}/quizzes`)}
                    triggerRefresh={() => setRefresh(true)}
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
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>title</TableCell>
                                <TableCell>max attempts</TableCell>
                                <TableCell>published</TableCell>
                                <TableCell>prevent edit</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quizzes.map((q) => (
                                <TableRow
                                    key={q.id}
                                    hover={true}
                                    onClick={() => {
                                        navigate(`/quizzes/${q.id}`);
                                    }}
                                >
                                    <TableCell>{q.title}</TableCell>
                                    <TableCell>{q.max_attempts}</TableCell>
                                    <TableCell>
                                        {q.published.toString()}
                                    </TableCell>
                                    <TableCell>
                                        {q.prevent_edit.toString()}
                                    </TableCell>
                                    <TableCell>
                                        {!q.prevent_delete ? (
                                            <Button
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelected(q);
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
                </TableContainer>
            </Box>
            <Confirm
                description={`${selected?.title}`}
                method="DELETE"
                title="Delete"
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
                open={showDelete}
                setAlert={setAlert}
                url={server(`/quizzes/${selected?.id}`)}
                toggleRefresh={() => setRefresh(true)}
            />
        </Box>
    );
};

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
                <SectionDisplay
                    parent={manual}
                    parentName="Manual"
                    getUrl={server(`manuals/${manual.id}/sections`)}
                    postUrl={server(`manuals/${manual.id}/sections`)}
                    deleteUrl={(id?: number) =>
                        server(`/manuals/sections/${id}`)
                    }
                    viewSectionUrl={(id?: number) =>
                        `/manuals/${manual.id}/sections/${id}`
                    }
                    setAlert={setAlert}
                />
                <ManualQuizzes manual={manual} setAlert={setAlert} />
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
