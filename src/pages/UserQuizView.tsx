import { Check } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loading from "src/components/Loading";
import { usePrompt } from "src/hooks/useBlocker";
import { server } from "src/util/permalink";
import { Answer } from "./QuizQuestionView";
import { Question, Section } from "./QuizSectionView";
import { Quiz } from "./QuizzesList";

type CompleteQuiz = Quiz & {
    sections: (Section & { questions: (Question & { answers: Answer[] })[] })[];
};

const UserQuizView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<CompleteQuiz | undefined>();
    const [startQuiz, setStartQuiz] = useState(false);
    const [submitQuiz, setSubmitQuiz] = useState(false);
    const [selectedSection, setSelectedSection] = useState<
        | (Section & { questions: (Question & { answers: Answer[] })[] })
        | undefined
    >();

    // TODO: submit quiz attempt on exit
    usePrompt(
        "Are you sure you want to leave the quiz? Your progress will not be saved.",
        startQuiz
    );

    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

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
                                    .then(
                                        (
                                            questions: (Question & {
                                                answers: Answer[];
                                            })[]
                                        ) => ({ ...s, questions })
                                    )
                            )
                        )
                    )
                    .then(
                        (
                            sections: (Section & {
                                questions: (Question & { answers: Answer[] })[];
                            })[]
                        ) => ({ ...q, sections })
                    )
            )
            .then((q) => {
                setQuiz(q);
                return q;
            })
            .then((q) => {
                if (q && q.sections.length > 0)
                    setSelectedSection(q.sections[0]);
            });

        return () => {
            controller.abort();
        };
    }, [id]);

    useEffect(() => {
        if (startQuiz) {
            // TODO: Make call to create new quiz attempt
            // TODO: Store quiz attempt id
        }
    }, [startQuiz]);

    useEffect(() => {
        if (submitQuiz) {
            // TODO: submit quiz
            // TODO: Make call to end quiz attempt using quiz attempt id
            navigate(-1);
        }
        // navigate in useEffect causes weird things to happen
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitQuiz]);

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
                    <Box
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "2rem",
                        }}
                    >
                        {startQuiz ? (
                            <Paper
                                sx={{
                                    maxWidth: "max-content",
                                    minWidth: "20rem",
                                }}
                            >
                                <MenuList dense>
                                    {quiz.sections.map((s, index) => (
                                        <MenuItem
                                            key={`section${index}`}
                                            onClick={() =>
                                                setSelectedSection(s)
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
                                                selectedSection &&
                                                s.id === selectedSection.id ? (
                                                    <ListItemIcon>
                                                        <Check />
                                                    </ListItemIcon>
                                                ) : null
                                            }
                                            <ListItemText key={s.title} inset>
                                                {s.title}
                                            </ListItemText>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Paper>
                        ) : null}
                        {startQuiz ? (
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
                                    {selectedSection
                                        ? selectedSection.questions.map(
                                              (q, index) => (
                                                  <Box
                                                      key={`question${index}`}
                                                      sx={{
                                                          display: "flex",
                                                          flexDirection:
                                                              "column",
                                                          gap: "1rem",
                                                          margin: "1rem",
                                                      }}
                                                  >
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
                                                      <Box
                                                          sx={{
                                                              display: "flex",
                                                              flexDirection:
                                                                  "column",
                                                              alignItems:
                                                                  "flex-start",
                                                          }}
                                                      >
                                                          {q.question_type ===
                                                              "true or false" ||
                                                          q.question_type ===
                                                              "single correct - multiple choice" ? (
                                                              <RadioGroup>
                                                                  {q.answers.map(
                                                                      (
                                                                          a,
                                                                          index
                                                                      ) => (
                                                                          <FormControlLabel
                                                                              key={
                                                                                  a.answer +
                                                                                  index.toString()
                                                                              }
                                                                              value={
                                                                                  a.answer
                                                                              }
                                                                              control={
                                                                                  <Radio />
                                                                              }
                                                                              label={a.answer.toString()}
                                                                          />
                                                                      )
                                                                  )}
                                                              </RadioGroup>
                                                          ) : q.question_type ===
                                                            "multiple correct - multiple choice" ? (
                                                              q.answers.map(
                                                                  (
                                                                      a,
                                                                      index
                                                                  ) => (
                                                                      <FormControlLabel
                                                                          key={
                                                                              a.answer +
                                                                              index.toString()
                                                                          }
                                                                          value={
                                                                              a.answer
                                                                          }
                                                                          control={
                                                                              <Checkbox />
                                                                          }
                                                                          label={
                                                                              a.answer
                                                                          }
                                                                      />
                                                                  )
                                                              )
                                                          ) : null}
                                                      </Box>
                                                      {index !==
                                                      selectedSection.questions
                                                          .length -
                                                          1 ? (
                                                          <hr
                                                              style={{
                                                                  width: "100%",
                                                              }}
                                                          />
                                                      ) : null}
                                                  </Box>
                                              )
                                          )
                                        : null}
                                </Box>
                            </Paper>
                        ) : null}
                    </Box>
                    <Box>
                        {!startQuiz ? (
                            <Button
                                variant="contained"
                                onClick={() => setStartQuiz(true)}
                            >
                                Start Quiz
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setSubmitQuiz(true)}
                            >
                                Submit
                            </Button>
                        )}
                    </Box>
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

export default UserQuizView;
