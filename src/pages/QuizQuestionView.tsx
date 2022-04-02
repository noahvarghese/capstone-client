import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Link as MuiLink,
    Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import DynamicDataTable from "src/components/DynamicDataTable";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Question, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

export interface Answer {
    id: number;
    answer: string;
    correct: boolean;
}

const QuizQuestionView: React.FC = () => {
    const { id, section_id, quiz_id } =
        useParams<{ id?: string; section_id?: string; quiz_id?: string }>();
    const [quiz, setQuiz] = useState<Quiz | undefined>();
    const [quizSection, setQuizSection] = useState<Section | undefined>();
    const [quizQuestion, setQuizQuestion] = useState<Question | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const [refreshDynamicTable, setRefreshForDynamicTable] = useState(false);

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
                fetch(server(`quizzes/sections/${section_id}`), fetchOptions)
                    .then((res) => res.json())
                    .then(setQuizSection),
                fetch(server(`quizzes/sections/questions/${id}`), fetchOptions)
                    .then((res) => res.json())
                    .then(setQuizQuestion),
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
    }, [id, section_id, quiz_id, refresh]);

    if (!quiz || !quizSection || !quizQuestion) return <Loading />;

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
            <Typography variant="h1">Quiz Question</Typography>
            <Typography variant="h2">
                {quiz.title}: {quizSection.title}
                <br />
                {quizQuestion.question}
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
                        title="Update Question"
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        setAlert={setAlert}
                        triggerRefresh={() => {
                            setRefresh(true);
                            setRefreshForDynamicTable(true);
                        }}
                        disableSubmit={quiz.prevent_edit}
                        url={server(
                            `/quizzes/sections/questions/${quizQuestion.id}`
                        )}
                        titleVariant="h5"
                        formOptions={{
                            question: {
                                defaultValue: quizQuestion.question,
                                label: "question",
                                type: "input",
                                registerOptions: {
                                    required: "question cannot be empty",
                                },
                            },
                            question_type: {
                                defaultValue: quizQuestion.question_type,
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
                    />
                    <List>
                        <MuiLink to={`/quizzes/${quiz.id}`} component={Link}>
                            <ListItem>
                                <ListItemText
                                    primary="quiz"
                                    secondary={quiz.title}
                                />
                            </ListItem>
                        </MuiLink>
                        <MuiLink
                            to={`/quizzes/${quiz.id}/sections/${quizSection.id}`}
                            component={Link}
                        >
                            <ListItem>
                                <ListItemText
                                    primary="section"
                                    secondary={quizSection.title}
                                />
                            </ListItem>
                        </MuiLink>
                        <ListItem>
                            <ListItemText
                                primary="question"
                                secondary={quizQuestion.question}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="question type"
                                secondary={quizQuestion.question_type}
                            />
                        </ListItem>
                    </List>
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        * 'true or false' type questions require that you
                        designate one answer as correct
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        * 'single correct - multiple choice' type questions will
                        unset correct answers when designating another answer as
                        correct
                    </Typography>
                </Box>
                <DynamicDataTable<Answer>
                    columns={[
                        { key: "answer", value: "answer" },
                        { key: "correct", value: "correct" },
                    ]}
                    controlledRefresh={{
                        refreshComplete: () => setRefreshForDynamicTable(false),
                        shouldRefresh: refreshDynamicTable,
                    }}
                    deleteUrl={(id) =>
                        server(`/quizzes/sections/questions/answers/${id}`)
                    }
                    description={(a) => `${a?.answer}`}
                    formOptions={{
                        answer: {
                            defaultValue: "",
                            label: "answer",
                            type: "input",
                            registerOptions: {
                                required: "answer cannot be empty",
                            },
                        },
                        correct: {
                            defaultValue: "",
                            label: "correct",
                            type: "select",
                            items: [
                                { key: "true", value: "true" },
                                { key: "false", value: "false" },
                            ],
                            registerOptions: {
                                setValueAs: (v) => v === "true",
                                required: "correct cannot be empty",
                            },
                        },
                    }}
                    getUrl={server(
                        `/quizzes/sections/questions/${quizQuestion.id}/answers`
                    )}
                    modelName="Quiz Answer"
                    navigateUrl={(id) =>
                        `/quizzes/${quiz.id}/sections/${quizSection.id}/questions/${quizQuestion.id}/answers/${id}`
                    }
                    postUrl={server(
                        `/quizzes/sections/questions/${quizQuestion.id}/answers`
                    )}
                    setAlert={setAlert}
                    disableForm={
                        quiz.prevent_edit ||
                        quizQuestion.question_type === "true or false"
                    }
                    disableDeleteForTable={
                        quiz.prevent_edit ||
                        quizQuestion.question_type === "true or false"
                    }
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

export default QuizQuestionView;
