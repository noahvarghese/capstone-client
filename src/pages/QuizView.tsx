import {
    Alert,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import SectionDisplay from "src/components/Section";
import { server } from "src/util/permalink";
import { Quiz } from "./QuizzesList";

const QuizView = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/quizzes/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    try {
                        if (res.ok) {
                            const r = await res.json();
                            setQuiz(r);
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

    if (!quiz) {
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
            <Typography variant="h1">Quiz</Typography>
            <Typography variant="h2">{quiz.title}</Typography>
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
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        title="Update Quiz"
                        setAlert={setAlert}
                        titleVariant="h5"
                        triggerRefresh={() => setRefresh(true)}
                        url={server(`/quizzes/${quiz.id}`)}
                        formOptions={{
                            title: {
                                defaultValue: quiz.title,
                                label: "title",
                                type: "input",
                                registerOptions: {
                                    required: "title cannot be empty",
                                    disabled: quiz.prevent_edit,
                                },
                            },
                            max_attempts: {
                                defaultValue: quiz.max_attempts,
                                label: "max attempts",
                                type: "input",
                                inputType: "number",
                                registerOptions: {
                                    disabled: quiz.prevent_edit,
                                    required: "max attempts cannot be empty",
                                },
                            },
                            prevent_edit: {
                                defaultValue: quiz.prevent_edit,
                                label: "prevent edit",
                                type: "checkbox",
                                registerOptions: {},
                            },
                            prevent_delete: {
                                defaultValue: quiz.prevent_delete,
                                label: "prevent delete",
                                type: "checkbox",
                                registerOptions: {
                                    disabled: quiz.prevent_edit,
                                },
                            },
                            published: {
                                defaultValue: quiz.published,
                                label: "publish",
                                type: "checkbox",
                                registerOptions: {
                                    disabled: quiz.prevent_edit,
                                },
                            },
                        }}
                    />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="title"
                                secondary={quiz.title}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="title"
                                secondary={quiz.max_attempts}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent edit"
                                secondary={quiz.prevent_edit.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent delete"
                                secondary={quiz.prevent_delete.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="published"
                                secondary={quiz.published.toString()}
                            />
                        </ListItem>
                    </List>
                </Box>
                <SectionDisplay
                    parent={quiz}
                    parentName="Quiz"
                    getUrl={server(`quizzes/${quiz.id}/sections`)}
                    postUrl={server(`quizzes/${quiz.id}/sections`)}
                    deleteUrl={(id?: number) =>
                        server(`/quizzes/sections/${id}`)
                    }
                    viewSectionUrl={(id?: number) =>
                        `/quizzes/${quiz.id}/sections/${id}`
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

export default QuizView;
