import { Check } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Prompt, useParams, useHistory } from "react-router-dom";
import Loading from "src/components/Loading";
import useQuizDisplay from "src/components/QuizDisplay";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Question, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

type CompleteQuestion = Question & { answers: Answer[] };

type CompleteSection = Section & { questions: CompleteQuestion[] };

export type CompleteQuiz = Quiz & {
    sections: CompleteSection[];
};

const UserQuizView: React.FC = () => {
    const { id } = useParams<{ id?: string | undefined }>();
    const history = useHistory();
    const [quiz, setQuiz] = useState<CompleteQuiz | undefined>();
    const [startQuiz, setStartQuiz] = useState(false);
    const [submitQuiz, setSubmitQuiz] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState<
        number | undefined
    >();
    const selectedSection = useMemo(() => {
        if (!quiz || !selectedSectionId) return undefined;

        return quiz.sections.find((s) => s.id === selectedSectionId);
    }, [quiz, selectedSectionId]);

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    const [quizAttemptId, setQuizAttemptId] = useState<number>(NaN);

    const defaultValues = useMemo(() => {
        if (!quiz) return {};

        const values: { [question: string]: string | string[] } = {};

        for (let i = 0; i < quiz.sections.length; i++) {
            for (let j = 0; j < quiz.sections[i].questions.length; j++) {
                values[
                    quiz.sections[i].questions[j].question.split(" ").join("")
                ] =
                    quiz.sections[i].questions[j].question_type ===
                    "multiple correct - multiple choice"
                        ? []
                        : "";
            }
        }

        return values;
    }, [quiz]);

    const { control, handleSubmit } = useForm({ mode: "all", defaultValues });

    const submit = useCallback(
        (data) => {
            console.log(data);
            Promise.all(
                Object.entries(data).map(async ([key, value]) => {
                    if (Array.isArray(value)) {
                        return Promise.all(
                            value.map((v) =>
                                fetch(
                                    server(
                                        `/quizzes/attempts/${quizAttemptId}/results/${key}`
                                    ),
                                    {
                                        method: "POST",
                                        credentials: "include",
                                        mode: "cors",
                                        body: JSON.stringify({
                                            quiz_answer_id: v,
                                        }),
                                    }
                                )
                            )
                        );
                    } else {
                        return fetch(
                            server(
                                `/quizzes/attempts/${quizAttemptId}/results/${key}`
                            ),
                            {
                                method: "POST",
                                credentials: "include",
                                mode: "cors",
                                body: JSON.stringify({
                                    quiz_answer_id: Number(value),
                                }),
                            }
                        );
                    }
                })
            )
                .then(() => {
                    fetch(server(`/quizzes/attempts/${quizAttemptId}`), {
                        method: "PUT",
                        mode: "cors",
                        credentials: "include",
                    });
                })
                .then(() => {
                    setSubmitQuiz(true);
                });
        },
        [quizAttemptId]
    );

    useEffect(() => {
        if (submitQuiz) history.push("/quizzes");
    }, [submitQuiz, history]);

    useEffect(() => {
        if (startQuiz) {
            // TODO: Make call to create new quiz attempt
            fetch(server(`/quizzes/${id}/attempts`), {
                method: "POST",
                credentials: "include",
                mode: "cors",
            })
                .then((res) => res.json())
                .then(({ quizAttemptId: attemptId }) =>
                    setQuizAttemptId(attemptId)
                )
                .catch(() => {
                    history.push("/quizzes");
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, startQuiz]);

    // TODO: submit quiz attempt on exit after prompt (via useEffect cleanup)
    const quizDisplay = useQuizDisplay({ control, disabled: false, quiz });

    // Get full document
    useEffect(() => {
        const controller = new AbortController();
        const fetchOptions: RequestInit = {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        };

        fetch(server(`/quizzes/${id}`), fetchOptions)
            .then((res) => res.json())
            .then((q: Quiz) =>
                fetch(server(`/quizzes/${id}/sections`), fetchOptions)
                    .then((res) => res.json())
                    .then((sections: Section[]) =>
                        Promise.all(
                            sections.map((s: Section) =>
                                fetch(
                                    server(
                                        `/quizzes/sections/${s.id}/questions`
                                    ),
                                    fetchOptions
                                )
                                    .then((res) => res.json())
                                    .then((questions: Question[]) =>
                                        Promise.all(
                                            questions.map((q) =>
                                                fetch(
                                                    server(
                                                        `/quizzes/sections/questions/${q.id}/answers`
                                                    ),
                                                    fetchOptions
                                                )
                                                    .then((res) => res.json())
                                                    .then(
                                                        (
                                                            answers: Answer[]
                                                        ) => ({ ...q, answers })
                                                    )
                                            )
                                        )
                                    )
                                    .then((questions: CompleteQuestion[]) => ({
                                        ...s,
                                        questions,
                                    }))
                            )
                        )
                    )
                    .then((sections: CompleteSection[]) => ({ ...q, sections }))
            )
            .then((q) => {
                if (q && q.sections.length > 0)
                    setSelectedSectionId(q.sections[0].id);
                setQuiz(q);
            })
            .catch((e) => {
                const { message } = e as Error;
                console.error(message);
                setAlert({
                    severity: "error",
                    message: "Error retrieving data",
                });
            });

        return () => {
            controller.abort();
        };
    }, [id]);

    if (!quiz || submitQuiz) return <Loading />;

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
            <Typography variant="h1">{quiz.title.toUpperCase()}</Typography>
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
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "2rem",
                    }}
                >
                    {startQuiz ? (
                        <Box
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "2rem",
                            }}
                        >
                            <Box
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2rem",
                                }}
                            >
                                <Paper
                                    sx={{
                                        maxWidth: "max-content",
                                        minWidth: "20rem",
                                    }}
                                >
                                    <MenuList dense>
                                        {quiz.sections.map(
                                            (s: CompleteSection, index) => (
                                                <MenuItem
                                                    key={`section${index}`}
                                                    onClick={() =>
                                                        setSelectedSectionId(
                                                            s.id
                                                        )
                                                    }
                                                    style={{
                                                        paddingRight: "2rem",
                                                        textAlign: "right",
                                                        minWidth: "20rem",
                                                        maxWidth: "max-content",
                                                    }}
                                                >
                                                    {
                                                        // TODO: Check if selected is set otherwise use first section
                                                        selectedSectionId &&
                                                        s.id ===
                                                            selectedSectionId ? (
                                                            <ListItemIcon>
                                                                <Check />
                                                            </ListItemIcon>
                                                        ) : null
                                                    }
                                                    <ListItemText
                                                        key={s.title}
                                                        inset
                                                    >
                                                        {s.title}
                                                    </ListItemText>
                                                </MenuItem>
                                            )
                                        )}
                                    </MenuList>
                                </Paper>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit(submit)}
                                >
                                    Submit
                                </Button>
                            </Box>
                            <Paper
                                sx={{
                                    padding: "2rem",
                                    width: "50vw",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5rem",
                                }}
                            >
                                <Typography variant="h3">
                                    {selectedSection?.title}
                                </Typography>
                                <Box>
                                    {selectedSectionId
                                        ? quizDisplay[selectedSectionId]
                                        : null}
                                </Box>
                            </Paper>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => setStartQuiz(true)}
                        >
                            Start Quiz
                        </Button>
                    )}
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
            <Prompt
                when={startQuiz && !submitQuiz}
                message="Are you sure you want to leave the quiz? Your current progress will be submitted."
            />
        </div>
    );
};

export default UserQuizView;
