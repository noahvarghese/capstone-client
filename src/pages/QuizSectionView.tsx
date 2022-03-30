import {
    Alert,
    Box,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import DynamicDataTable from "src/components/DynamicDataTable";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Quiz } from "./QuizzesList";

export interface Section {
    id: number;
    title: string;
}

export interface Question {
    id: number;
    question: string;
    question_type:
        | "true or false"
        | "multiple correct - multiple choice"
        | "single correct - multiple choice";
}

const QuizSectionView: React.FC = () => {
    const { id, quiz_id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | undefined>();
    const [quizSection, setQuizSection] = useState<Section | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

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
                fetch(server(`quizzes/${quiz_id}`), fetchOptions)
                    .then((res) => res.json())
                    .then(setQuiz),
                fetch(server(`quizzes/sections/${id}`), fetchOptions)
                    .then((res) => res.json())
                    .then(setQuizSection),
            ])
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
    }, [id, quiz_id, refresh]);

    if (!quiz || !quizSection) return <Loading />;

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
            <Typography variant="h1">Quiz Section</Typography>
            <Typography variant="h2">
                {quiz.title}: {quizSection.title}
            </Typography>
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
                        title="Update Quiz Section"
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        setAlert={setAlert}
                        triggerRefresh={() => setRefresh(true)}
                        disableSubmit={quiz.prevent_edit}
                        url={server(`/quizzes/sections/${quizSection.id}`)}
                        titleVariant="h5"
                        formOptions={{
                            title: {
                                defaultValue: quizSection.title,
                                label: "title",
                                type: "input",
                                registerOptions: {
                                    required: "title cannot be empty",
                                },
                            },
                        }}
                    />
                    <List>
                        <MuiLink to={`/quizzes/${quiz.id}`} component={Link}>
                            <ListItem>
                                <ListItemText
                                    primary="quiz title"
                                    secondary={quiz.title}
                                />
                            </ListItem>
                        </MuiLink>
                        <ListItem>
                            <ListItemText
                                primary="section title"
                                secondary={quizSection.title}
                            />
                        </ListItem>
                    </List>
                </Box>
                <DynamicDataTable<Question>
                    columns={[
                        { key: "question", value: "question" },
                        { key: "question_type", value: "type" },
                    ]}
                    deleteUrl={(id) =>
                        server(`/quizzes/sections/questions/${id}`)
                    }
                    description={(q) => `${q?.question}`}
                    formOptions={{
                        question: {
                            defaultValue: "",
                            label: "question",
                            type: "input",
                            registerOptions: {
                                required: "question cannot be empty",
                            },
                        },
                        question_type: {
                            defaultValue: "",
                            label: "question type",
                            type: "select",
                            items: [
                                {
                                    key: "true or false",
                                    value: "true or false",
                                },
                                {
                                    key: "multiple correct - multiple choice",
                                    value: "multiple correct - multiple choice",
                                },
                                {
                                    key: "single correct - multiple choice",
                                    value: "single correct - multiple choice",
                                },
                            ],
                            registerOptions: {
                                required: "question type cannot be empty",
                            },
                        },
                    }}
                    getUrl={server(
                        `/quizzes/sections/${quizSection.id}/questions`
                    )}
                    modelName="Quiz Question"
                    navigateUrl={(id) =>
                        `/quizzes/${quiz.id}/sections/${quizSection.id}/questions/${id}`
                    }
                    postUrl={server(
                        `/quizzes/sections/${quizSection.id}/questions`
                    )}
                    setAlert={setAlert}
                    disableForm={quiz.prevent_edit}
                    disableDeleteForTable={quiz.prevent_edit}
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

export default QuizSectionView;
