import { Alert, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "src/components/Loading";
import { Section } from "src/components/Section";
import { server } from "src/util/permalink";
import { Quiz } from "./QuizzesList";

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
        ]).catch((e) =>
            setAlert({ message: (e as Error).message, severity: "error" })
        );

        return () => {
            controller.abort();
        };
    }, [id, quiz_id]);

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
            <Typography variant="h1">Quiz</Typography>
            <Typography variant="h2">
                {quiz.title}: {quizSection.title}
            </Typography>
            <Box></Box>
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
