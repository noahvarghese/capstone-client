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
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Prompt, useParams, useHistory } from "react-router-dom";
import Input from "src/components/DynamicForm/Input";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Question, QuestionType, Section } from "./QuizSectionView";
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

    const [formState, setFormState] = useState<
        { [questionId: number]: "" | number | number[] } | undefined
    >();

    const formElementsRefs = useRef<Array<HTMLElement | null>>([]);
    useEffect(() => {
        // TODO: Get number of elements as number of total possible answers
        // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
        formElementsRefs.current = formElementsRefs.current.slice(0, Infinity);
    }, [formState]);

    useEffect(() => {
        if (!quiz) {
            if (formState) setFormState(undefined);
            return;
        }

        if (formState) return;

        let state: { [questionId: number]: "" | number | number[] } = {};

        for (let i = 0; i < quiz.sections.length; i++) {
            for (let j = 0; j < quiz.sections[i].questions.length; j++) {
                const { id, question_type } = quiz.sections[i].questions[j];
                if (question_type === "multiple correct - multiple choice")
                    state[id] = [];
                else if (question_type === "single correct - multiple choice")
                    state[id] = "";
                else if (question_type === "true or false") state[id] = "";
            }
        }

        setFormState(state);
    }, [formState, quiz]);

    const setAnswer = useCallback(
        (
            questionId: number,
            _answerId: string | number,
            questionType: QuestionType
        ) => {
            if (!formState) return;

            const answerId =
                typeof _answerId === "string" ? Number(_answerId) : _answerId;

            if (questionType === "true or false")
                formState[questionId] = answerId;
            else if (questionType === "single correct - multiple choice")
                formState[questionId] = answerId;
            else if (questionType === "multiple correct - multiple choice") {
                if (Array.isArray(formState[questionId])) {
                    const answerArray = formState[questionId] as Array<number>;
                    if (answerArray.includes(answerId)) {
                        answerArray.splice(answerArray.indexOf(answerId));
                    } else {
                        answerArray.push(answerId);
                    }
                }
            }

            console.log(formState);
            setFormState(formState);
        },
        [formState]
    );

    const submit = useCallback(() => {
        console.log(formState);
        // TODO: submit quiz
        // TODO: Make call to end quiz attempt using quiz attempt id
        setSubmitQuiz(true);
    }, [formState]);

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

        if (!quiz || !formState) return sectionsMap;

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
                            <FormControl>
                                <FormLabel id={questionName}>
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
                                    <RadioGroup
                                        name={questionName}
                                        aria-labelledby={questionName}
                                        onChange={(_, value) => {
                                            setAnswer(
                                                q.id,
                                                value,
                                                q.question_type
                                            );
                                        }}
                                        value={formState[q.id].toString()}
                                    >
                                        {q.answers.map((a, index) => (
                                            <Input
                                                key={`question_${questionName}_answer${a.answer.toString()}${index}`}
                                                label={a.answer.toString()}
                                                disabled={false}
                                                type="radio"
                                                value={a.id.toString()}
                                            />
                                        ))}
                                    </RadioGroup>
                                ) : q.question_type ===
                                  "single correct - multiple choice" ? (
                                    <RadioGroup
                                        aria-labelledby={questionName}
                                        onChange={(_, value) => {
                                            setAnswer(
                                                q.id,
                                                value,
                                                q.question_type
                                            );
                                        }}
                                        value={formState[q.id].toString()}
                                    >
                                        {q.answers.map((a, index) => (
                                            <Input
                                                key={`question_${questionName}_answer${a.answer.toString()}${index}`}
                                                label={a.answer.toString()}
                                                disabled={false}
                                                type="radio"
                                                value={a.id.toString()}
                                            />
                                        ))}
                                    </RadioGroup>
                                ) : q.question_type ===
                                  "multiple correct - multiple choice" ? (
                                    <FormGroup>
                                        {q.answers.map((a, index) => (
                                            <Input
                                                key={
                                                    q.question +
                                                    "_answer" +
                                                    a.answer +
                                                    index.toString()
                                                }
                                                checked={(
                                                    formState[
                                                        q.id
                                                    ]! as Array<number>
                                                ).includes(a.id)}
                                                label={a.answer}
                                                disabled={false}
                                                type="checkbox"
                                                field={{
                                                    onChange: () => {
                                                        setAnswer(
                                                            q.id,
                                                            a.id,
                                                            q.question_type
                                                        );
                                                    },
                                                    name: q.question,
                                                    onBlur: () => {
                                                        return;
                                                    },
                                                    ref: () => {
                                                        return;
                                                    },
                                                    value: a.id.toString(),
                                                }}
                                            />
                                        ))}
                                    </FormGroup>
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
    }, [formState, quiz, setAnswer]);

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
                                <Button variant="contained" onClick={submit}>
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
