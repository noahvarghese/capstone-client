import { Check } from "@mui/icons-material";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import useQuizDisplay from "src/components/QuizDisplay";
import AppContext from "src/context";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Question, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";
import { QuizAttempt } from "./UserQuizList";
import {
    CompleteQuestion,
    CompleteQuiz,
    CompleteSection,
} from "./UserQuizView";

const ScoreView: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { userId } = useContext(AppContext);
    const [quiz, setQuiz] = useState<CompleteQuiz | undefined>();
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [selectedAttemptId, setSelectedAttemptId] = useState<
        number | undefined
    >();
    const [selectedSectionId, setSelectedSectionId] = useState<
        number | undefined
    >();
    const selectedSection = useMemo(() => {
        if (!quiz || !selectedSectionId) return undefined;

        return quiz.sections.find((s) => s.id === selectedSectionId);
    }, [quiz, selectedSectionId]);

    const [answers, setAnswers] = useState<Record<number, number[] | number>>(
        []
    );

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
            });

        return () => {
            controller.abort();
        };
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();

        fetch(server(`/quizzes/${id}/attempts/users/${userId}`), {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                setSelectedAttemptId(data[0].id);
                return data;
            })
            .then(setAttempts);

        return () => {
            controller.abort();
        };
    }, [id, userId]);

    useEffect(() => {
        if (!selectedAttemptId || !userId) return;

        const controller = new AbortController();

        fetch(
            server(`/quizzes/attempts/${selectedAttemptId}/${userId}/results`),
            {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            }
        )
            .then((res) => res.json())
            .then(
                (
                    data: {
                        quiz_attempt_id: number;
                        quiz_question_id: number;
                        quiz_answer_id: number;
                    }[]
                ) => {
                    return data.reduce((prev, curr) => {
                        if (prev[curr.quiz_question_id]) {
                            if (Array.isArray(prev[curr.quiz_question_id])) {
                                (
                                    prev[curr.quiz_question_id] as Array<number>
                                ).push(curr.quiz_answer_id);
                            } else {
                                prev[curr.quiz_question_id] = [
                                    prev[curr.quiz_question_id] as number,
                                    curr.quiz_answer_id,
                                ];
                            }
                        } else {
                            prev[curr.quiz_question_id] = curr.quiz_answer_id;
                        }

                        return prev;
                    }, {} as Record<number, number | number[]>);
                }
            )
            .then(setAnswers);

        return () => {
            controller.abort();
        };
    }, [selectedAttemptId, userId]);

    const quizDisplay = useQuizDisplay({ quiz, answers });

    if (!quiz) return <Loading />;

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
                                <List
                                    component="nav"
                                    subheader={
                                        <ListSubheader component="div">
                                            Attempts
                                        </ListSubheader>
                                    }
                                    dense
                                >
                                    {attempts.map((a: QuizAttempt, index) => (
                                        <ListItemButton
                                            key={`attempt${index}`}
                                            onClick={() =>
                                                setSelectedAttemptId(a.id)
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
                                                a.id === selectedAttemptId ? (
                                                    <ListItemIcon>
                                                        <Check />
                                                    </ListItemIcon>
                                                ) : null
                                            }
                                            <ListItemText
                                                key={`attempt${index + 1}`}
                                                inset
                                                primary={`Attempt ${index + 1}`}
                                                secondary={
                                                    a.score === -1
                                                        ? "Incomplete"
                                                        : `Result: ${a.score}/${a.total}`
                                                }
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Paper>
                        </Box>
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
                                <List
                                    subheader={
                                        <ListSubheader>Sections</ListSubheader>
                                    }
                                    dense
                                >
                                    {quiz.sections.map(
                                        (s: CompleteSection, index) => (
                                            <ListItemButton
                                                key={`section${index}`}
                                                onClick={() =>
                                                    setSelectedSectionId(s.id)
                                                }
                                                style={{
                                                    paddingRight: "2rem",
                                                    textAlign: "right",
                                                    minWidth: "20rem",
                                                    maxWidth: "max-content",
                                                }}
                                            >
                                                {selectedSectionId &&
                                                s.id === selectedSectionId ? (
                                                    <ListItemIcon>
                                                        <Check />
                                                    </ListItemIcon>
                                                ) : null}
                                                <ListItemText
                                                    key={s.title}
                                                    inset
                                                >
                                                    {s.title}
                                                </ListItemText>
                                            </ListItemButton>
                                        )
                                    )}
                                </List>
                            </Paper>
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
                            <Box key={`attempt${selectedAttemptId}`}>
                                {selectedSectionId
                                    ? quizDisplay[selectedSectionId]
                                    : null}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default ScoreView;
