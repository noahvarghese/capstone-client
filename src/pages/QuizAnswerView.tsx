import {
    Typography,
    Box,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
    Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Section, Question } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

const QuizAnswerView = () => {
    const { id, question_id, section_id, quiz_id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | undefined>();
    const [quizSection, setQuizSection] = useState<Section | undefined>();
    const [quizQuestion, setQuizQuestion] = useState<Question | undefined>();
    const [quizAnswer, setQuizAnswer] = useState<Answer | undefined>();

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
                fetch(server(`quizzes/sections/${section_id}`), fetchOptions)
                    .then((res) => res.json())
                    .then(setQuizSection),
                fetch(
                    server(`quizzes/sections/questions/${question_id}`),
                    fetchOptions
                )
                    .then((res) => res.json())
                    .then(setQuizQuestion),
                fetch(
                    server(`quizzes/sections/questions/answers/${id}`),
                    fetchOptions
                )
                    .then((res) => res.json())
                    .then(setQuizAnswer),
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
    }, [id, section_id, quiz_id, refresh, question_id]);

    if (!quiz || !quizSection || !quizQuestion || !quizAnswer)
        return <Loading />;

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
            <Typography variant="h1">Quiz Answer</Typography>
            <Typography variant="h2">
                {quiz.title}: {quizSection.title}
                <br />
                {quizQuestion.question}
                {quizQuestion.question[quizQuestion.question.length - 1] !== "?"
                    ? "?"
                    : ""}
                : {quizAnswer.answer}
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
                    {
                        // TODO: Fix boolean passing in request
                    }
                    <DynamicForm
                        title="Update Answer"
                        fetchOptions={{
                            method: "PUT",
                            credentials: "include",
                            mode: "cors",
                        }}
                        setAlert={setAlert}
                        triggerRefresh={() => {
                            setRefresh(true);
                        }}
                        disableSubmit={quiz.prevent_edit}
                        url={server(
                            `/quizzes/sections/questions/answers/${quizAnswer.id}`
                        )}
                        titleVariant="h5"
                        formOptions={{
                            answer: {
                                defaultValue: quizAnswer.answer,
                                label: "answer",
                                type: "input",
                                registerOptions: {
                                    disabled:
                                        quizQuestion.question_type ===
                                        "true or false",
                                    required: "answer cannot be empty",
                                },
                            },
                            correct: {
                                defaultValue: quizAnswer.correct.toString(),
                                label: "correct",
                                type: "select",
                                items: [
                                    { key: "true", value: "true" },
                                    { key: "false", value: "false" },
                                ],
                                registerOptions: {
                                    setValueAs: (v) => v === "true",
                                    required:
                                        "answer must be labeled as correct or not",
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
                        <MuiLink
                            to={`/quizzes/${quiz.id}/sections/${quizSection.id}/questions/${quizQuestion.id}`}
                            component={Link}
                        >
                            <ListItem>
                                <ListItemText
                                    primary="question"
                                    secondary={quizQuestion.question}
                                />
                            </ListItem>
                        </MuiLink>
                        <ListItem>
                            <ListItemText
                                primary="answer"
                                secondary={quizAnswer.answer}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="correct"
                                secondary={quizAnswer.correct.toString()}
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

export default QuizAnswerView;
