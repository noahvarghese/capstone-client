import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import Loading from "src/components/Loading";
import { Section } from "src/components/Section";
import { server } from "src/util/permalink";
import { Quiz } from "./QuizzesList";

const UpdateQuizSection: React.FC<{
    quiz: Quiz;
    section: Section;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
    toggleRefresh: () => void;
}> = ({ section, setAlert, toggleRefresh, quiz }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: {
            title: section.title,
        },
    });

    const submit = useCallback(
        async (data) => {
            await fetch(server(`/quizzes/sections/${section.id}`), {
                body: JSON.stringify(data),
                method: "PUT",
                credentials: "include",
                mode: "cors",
            }).then(async (res) => {
                if (res.ok) {
                    toggleRefresh();
                    setAlert({
                        message: `Updated quiz section: ${data.title}`,
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: `Unable to update quiz section: ${data.title}`,
                        severity: "error",
                    });
                }
            });
        },
        [section.id, setAlert, toggleRefresh]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Update Quiz
            </Typography>{" "}
            <form
                onSubmit={handleSubmit(submit)}
                style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <TextField
                    {...register("title", {
                        required: "title cannot be empty",
                    })}
                    id="title"
                    placeholder="title"
                    type="text"
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    label="title"
                    value={watch("title")}
                    required
                    disabled={quiz.prevent_edit || isSubmitting}
                />
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="reset"
                        disabled={quiz.prevent_edit || isSubmitting}
                        onClick={() => reset()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={quiz.prevent_edit || isSubmitting}
                    >
                        Update
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

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
            <Typography variant="h1">Quiz</Typography>
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
                    <UpdateQuizSection
                        quiz={quiz}
                        section={quizSection}
                        setAlert={setAlert}
                        toggleRefresh={() => setRefresh(true)}
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
