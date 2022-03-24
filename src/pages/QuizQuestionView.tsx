import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import DynamicDataTable from "src/components/DynamicDataTable";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Question, QuestionType, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

export interface Answer {
    id: number;
    answer: string;
    correct: boolean;
}

const QuizQuestionView: React.FC = () => {
    const { id, section_id, quiz_id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | undefined>();
    const [quizSection, setQuizSection] = useState<Section | undefined>();
    const [quizQuestion, setQuizQuestion] = useState<Question | undefined>();
    const [quizQuestionTypes, setQuizQuestionTypes] = useState<QuestionType[]>(
        []
    );
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        const controller = new AbortController();

        fetch(server(`/question_types`), {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then(setQuizQuestionTypes)
            .catch((e) => {
                const { message } = e as Error;
                console.error(message);
                setAlert({
                    message: "Unable to retrieve question types",
                    severity: "error",
                });
            });

        return () => {
            controller.abort();
        };
    }, []);

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
                        triggerRefresh={() => setRefresh(true)}
                        disableSubmit={quiz.prevent_edit}
                        url={server(
                            `/quizzes/sections/questions${quizQuestion.id}`
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
                            quiz_question_type_id: {
                                defaultValue:
                                    quizQuestion.quiz_question_type_id,
                                label: "question type",
                                type: "select",
                                items: quizQuestionTypes.map((qqt) => ({
                                    key: qqt.id,
                                    value: qqt.question_type,
                                })),
                                registerOptions: {
                                    required: "question type cannot be empty",
                                },
                            },
                        }}
                    />
                    <List>
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
                <DynamicDataTable<Answer>
                    columns={[
                        { key: "answer", value: "answer" },
                        { key: "correct", value: "correct" },
                    ]}
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

export default QuizQuestionView;
