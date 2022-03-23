import { Alert, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import DynamicForm from "src/components/DynamicForm";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Quiz } from "./QuizzesList";

interface Section {
    id: number;
    title: string;
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
                        title="Update Quiz"
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

export default QuizSectionView;
