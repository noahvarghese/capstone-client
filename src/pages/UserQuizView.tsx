import { Check } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormGroup,
    FormLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    RadioGroup,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Prompt, useParams, useHistory } from "react-router-dom";
import Input from "src/components/DynamicForm/Input";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Question, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

type CompleteQuestion = Question & { answers: Answer[] };

type CompleteSection = Section & { questions: CompleteQuestion[] };

type CompleteQuiz = Quiz & {
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

    const defaultValues = useMemo(() => {
        if (!quiz) return {};

        const values: { [question: string]: string } = {};

        for (let i = 0; i < quiz.sections.length; i++) {
            for (let j = 0; j < quiz.sections[i].questions.length; j++) {
                values[
                    quiz.sections[i].questions[j].question.split(" ").join("")
                ] = "";
            }
        }

        return values;
    }, [quiz]);

    const { control, handleSubmit } = useForm({ mode: "all", defaultValues });

    const submit = useCallback((data) => {
        console.log(data);
        // TODO: submit quiz
        // TODO: Make call to end quiz attempt using quiz attempt id
        // setSubmitQuiz(true);
    }, []);

    useEffect(() => {
        if (submitQuiz) history.push("/quizzes");
    }, [submitQuiz, history]);

    useEffect(() => {
        if (startQuiz) {
            // TODO: Make call to create new quiz attempt
            // TODO: Store quiz attempt id
        }
    }, [startQuiz]);

    // TODO: submit quiz attempt on exit after prompt

    const formInputs: { [sectionId: number]: JSX.Element[] } = useMemo(() => {
        // Store inputs in HashMap with the section.id as the key and an array of JSX.Elements as the value
        const sectionsMap: { [sectionId: number]: JSX.Element[] } = {};

        if (!quiz) return sectionsMap;

        const { sections } = quiz;

        // Iterate over all questions
        for (let i = 0; i < sections.length; i++) {
            const { questions } = sections[i];
            sectionsMap[sections[i].id] = [];

            for (let j = 0; j < questions.length; j++) {
                const q = questions[j];
                const questionName = q.question.split(" ").join("");

                // TODO: Add refs to each Input element
                sectionsMap[sections[i].id].push(
                    <Box
                        key={questionName}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            margin: "1rem",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        >
                            <FormControl component="fieldset">
                                <FormLabel id={questionName} component="legend">
                                    <Typography
                                        variant="h5"
                                        variantMapping={{
                                            h5: "h4",
                                        }}
                                        sx={{
                                            textAlign: "left",
                                        }}
                                    >
                                        {q.question}
                                    </Typography>
                                </FormLabel>
                                {q.question_type === "true or false" ? (
                                    <Controller
                                        control={control}
                                        name={questionName}
                                        render={({ field }) => (
                                            <RadioGroup
                                                aria-labelledby={questionName}
                                                {...field}
                                                defaultValue=""
                                                value={field.value ?? ""}
                                            >
                                                {q.answers.map((a, index) => (
                                                    <Input
                                                        key={`question_${questionName}_answer${a.answer
                                                            .split(" ")
                                                            .join("")}${index}`}
                                                        label={a.answer}
                                                        disabled={false}
                                                        type="radio"
                                                        value={a.id.toString()}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                ) : q.question_type ===
                                  "single correct - multiple choice" ? (
                                    <Controller
                                        control={control}
                                        name={q.question}
                                        render={({ field }) => (
                                            <RadioGroup
                                                aria-labelledby={questionName}
                                                {...field}
                                                defaultValue=""
                                                value={field.value ?? ""}
                                            >
                                                {q.answers.map((a, index) => (
                                                    <Input
                                                        key={`question_${questionName}_answer${a.answer
                                                            .split(" ")
                                                            .join("")}${index}`}
                                                        label={a.answer}
                                                        disabled={false}
                                                        type="radio"
                                                        value={a.id.toString()}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                ) : q.question_type ===
                                  "multiple correct - multiple choice" ? (
                                    <Controller
                                        name={questionName}
                                        control={control}
                                        render={({ field }) => (
                                            <FormGroup
                                                {...field}
                                                aria-labelledby={questionName}
                                                defaultValue=""
                                            >
                                                {q.answers.map((a, index) => (
                                                    <Input
                                                        key={`question_${questionName}_answer${a.answer
                                                            .split(" ")
                                                            .join("")}${index}`}
                                                        label={a.answer}
                                                        disabled={false}
                                                        type="checkbox"
                                                        value={a.id.toString()}
                                                    />
                                                ))}
                                            </FormGroup>
                                        )}
                                    />
                                ) : null}
                            </FormControl>
                        </Box>
                        {j !== sections[i].questions.length - 1 ? (
                            <hr
                                style={{
                                    width: "100%",
                                }}
                            />
                        ) : null}
                    </Box>
                );
            }
        }

        return sectionsMap;
    }, [control, quiz]);

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
                                        ? formInputs[selectedSectionId]
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
