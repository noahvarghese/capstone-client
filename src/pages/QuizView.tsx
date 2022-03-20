import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
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
import { server } from "src/util/permalink";
import { Quiz } from "./QuizzesList";

const UpdateQuiz: React.FC<{
    quiz: Quiz;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
    toggleRefresh: () => void;
}> = ({ quiz, setAlert, toggleRefresh }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: {
            title: quiz.title,
            max_attempts: quiz.max_attempts,
            prevent_edit: quiz.prevent_edit,
            prevent_delete: quiz.prevent_delete,
            published: quiz.published,
        },
    });

    const submit = useCallback(
        async (data) => {
            await fetch(server(`/quizzes/${quiz.id}`), {
                body: JSON.stringify({
                    ...data,
                    max_attempts: Number(data.max_attempts),
                    prevent_edit:
                        typeof data.prevent_edit === "string"
                            ? Boolean(data.prevent_edit)
                            : false,
                    prevent_delete:
                        typeof data.prevent_delete === "string"
                            ? Boolean(data.prevent_delete)
                            : false,
                    published:
                        typeof data.published === "string"
                            ? Boolean(data.published)
                            : false,
                }),
                method: "PUT",
                credentials: "include",
                mode: "cors",
            }).then(async (res) => {
                if (res.ok) {
                    toggleRefresh();
                    setAlert({
                        message: `Updated quiz: ${data.title}`,
                        severity: "success",
                    });
                } else {
                    setAlert({
                        message: `Unable to update quiz: ${data.title}`,
                        severity: "error",
                    });
                }
            });
        },
        [quiz.id, setAlert, toggleRefresh]
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
                <TextField
                    {...register("max_attempts", {
                        required: "max attempts cannot be empty",
                    })}
                    id="max_attempts"
                    placeholder="max attempts"
                    type="number"
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    label="max attempts"
                    value={watch("max_attempts")}
                    required
                    disabled={quiz.prevent_edit || isSubmitting}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            {...register("prevent_edit")}
                            value={true}
                            checked={Boolean(watch("prevent_edit"))}
                        />
                    }
                    label="prevent edit"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            {...register("prevent_delete")}
                            disabled={quiz.prevent_edit || isSubmitting}
                            checked={Boolean(watch("prevent_delete"))}
                            value={true}
                        />
                    }
                    label="prevent delete"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            {...register("published")}
                            value={true}
                            checked={Boolean(watch("published"))}
                            disabled={quiz.prevent_edit || isSubmitting}
                        />
                    }
                    label="publish"
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
                        disabled={isSubmitting}
                        onClick={() => reset()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Update
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

const QuizView = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/quizzes/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    try {
                        if (res.ok) {
                            const r = await res.json();
                            setQuiz(r);
                            return;
                        }
                    } catch (e) {
                        const { message } = e as Error;
                        setAlert({
                            message,
                            severity: "error",
                        });
                    }

                    setAlert({
                        message:
                            (await res.text()) ?? "Unable to retrieve manual",
                        severity: "error",
                    });
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({
                        message,
                        severity: "error",
                    });
                })
                .finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [id, refresh]);

    if (!quiz) {
        return <Loading />;
    }

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
            <Typography variant="h2">{quiz.title}</Typography>
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
                    <UpdateQuiz
                        quiz={quiz}
                        setAlert={setAlert}
                        toggleRefresh={() => setRefresh(true)}
                    />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="title"
                                secondary={quiz.title}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="title"
                                secondary={quiz.max_attempts}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent edit"
                                secondary={quiz.prevent_edit.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent delete"
                                secondary={quiz.prevent_delete.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="published"
                                secondary={quiz.published.toString()}
                            />
                        </ListItem>
                    </List>
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

export default QuizView;
