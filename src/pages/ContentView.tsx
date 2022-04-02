import {
    Alert,
    AppBar,
    Box,
    Paper,
    Typography,
    Link as MuiLink,
    Button,
    TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Content, ManualSection } from "./ManualSectionView";
import { Manual } from "./ManualsList";
import { Link } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { useForm } from "react-hook-form";
import { convertToRaw, EditorState, convertFromRaw } from "draft-js";

const ContentView = () => {
    const { section_id, manual_id, id } =
        useParams<{ id?: string; section_id?: string; manual_id?: string }>();

    const [manual, setManual] = useState<Manual | undefined>();
    const [manualSection, setManualSection] = useState<
        ManualSection | undefined
    >();

    const [content, setContent] = useState<Content | undefined>();

    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });
    const [editorShown, setEditorShown] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: { title: "" },
    });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();
            const fetchOptions: RequestInit = {
                method: "GET",
                mode: "cors",
                credentials: "include",
                signal: controller.signal,
            };

            Promise.all([
                fetch(server(`/manuals/${manual_id}`), fetchOptions)
                    .then(async (res) =>
                        res.ok
                            ? setManual(await res.json())
                            : setAlert({
                                  message:
                                      (await res.text()) ??
                                      "Error retrieving manual",
                                  severity: "error",
                              })
                    )
                    .catch((e) =>
                        setAlert({
                            message:
                                (e as Error).message ??
                                "Error retrieving manual",
                            severity: "error",
                        })
                    ),
                fetch(server(`/manuals/sections/${section_id}`), fetchOptions)
                    .then(async (res) =>
                        res.ok
                            ? setManualSection(await res.json())
                            : setAlert({
                                  message:
                                      (await res.text()) ??
                                      "Error retrieving manual section",
                                  severity: "error",
                              })
                    )
                    .catch((e) =>
                        setAlert({
                            message:
                                (e as Error).message ??
                                "Error retrieving manual section",
                            severity: "error",
                        })
                    ),
                fetch(server(`/manuals/sections/contents/${id}`), fetchOptions)
                    .then(async (res) => {
                        if (res.ok) {
                            const data = await res.json();
                            reset({ title: data.title });
                            setContent({
                                ...data,
                                content: data.content
                                    ? EditorState.createWithContent(
                                          convertFromRaw(data.content)
                                      )
                                    : EditorState.createEmpty(),
                            });
                        } else
                            setAlert({
                                message:
                                    (await res.text()) ??
                                    "Error retrieving manual contents",
                                severity: "error",
                            });
                    })
                    .catch((e) =>
                        setAlert({
                            message:
                                (e as Error).message ??
                                "Error retrieving manual contents",
                            severity: "error",
                        })
                    ),
            ]).finally(() => setRefresh(false));

            return () => controller.abort();
        }
    }, [id, manual_id, refresh, reset, section_id]);

    const submit = useCallback(
        async (data) => {
            const body = JSON.stringify({
                ...data,
                content: convertToRaw(
                    (
                        content?.content ?? EditorState.createEmpty()
                    ).getCurrentContent()
                ),
            });

            await fetch(server(`/manuals/sections/contents/${id}`), {
                method: "PUT",
                credentials: "include",
                body,
                mode: "cors",
            })
                .then(async (res) => {
                    if (res.ok) {
                        setAlert({
                            severity: "success",
                            message: "Succesfully updated content",
                        });
                        setRefresh(true);
                    } else {
                        setAlert({
                            severity: "error",
                            message:
                                (await res.text()) ?? "Error updating content",
                        });
                    }
                })
                .catch((e) => {
                    setAlert({
                        severity: "error",
                        message:
                            (e as Error).message ?? "Error updating content",
                    });
                });
        },
        [content, id]
    );

    if (!content || !manualSection || !manual) {
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
            <Paper
                style={{
                    margin: "auto",
                    width: "75vw",
                }}
            >
                <Box>
                    <Box></Box>
                    <AppBar
                        sx={{
                            position: "unset",
                            padding: "1rem 2rem",
                            borderRadius: "4px",
                        }}
                    >
                        <Typography
                            variant="h1"
                            style={{ color: "white", textAlign: "left" }}
                        >
                            {manual.title.toUpperCase()}
                        </Typography>
                    </AppBar>
                    <Box
                        sx={{
                            padding: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2rem",
                        }}
                    >
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "1rem",
                                    alignItems: "center",
                                }}
                            >
                                <MuiLink
                                    component={Link}
                                    to={`/manuals/${manual_id}`}
                                >
                                    <Typography
                                        variant="body2"
                                        style={{ fontSize: "1.25rem" }}
                                    >
                                        {manual.title}
                                    </Typography>
                                </MuiLink>
                                <Typography
                                    style={{ fontSize: "2rem" }}
                                    variant="body1"
                                >
                                    &#8250;
                                </Typography>
                                <MuiLink
                                    component={Link}
                                    to={`/manuals/${manual_id}/sections/${section_id}`}
                                >
                                    <Typography
                                        variant="body2"
                                        style={{ fontSize: "1.25rem" }}
                                    >
                                        {manualSection.title}
                                    </Typography>
                                </MuiLink>
                                <Typography
                                    style={{ fontSize: "2rem" }}
                                    variant="body1"
                                >
                                    &#8250;
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{ fontSize: "1.25rem" }}
                                >
                                    {content.title}
                                </Typography>
                            </Box>
                            {!manual.prevent_edit ? (
                                <Button
                                    variant={
                                        editorShown ? "outlined" : "contained"
                                    }
                                    onClick={() => setEditorShown(!editorShown)}
                                >
                                    Toggle Editor
                                </Button>
                            ) : null}
                        </Box>
                        <TextField
                            {...register("title", {
                                required: "title cannot be empty",
                            })}
                            label="title"
                            style={{
                                display:
                                    !manual.prevent_edit && editorShown
                                        ? "inline-flex"
                                        : "none",
                            }}
                            id="name"
                            error={Boolean(errors.title)}
                            helperText={errors.title?.message}
                            type="text"
                            value={watch("title", content.title)}
                            placeholder="title"
                            required
                            disabled={manual.prevent_edit || isSubmitting}
                        />
                        <Box
                            style={{
                                borderRadius: "4px",
                                border:
                                    !manual.prevent_edit && editorShown
                                        ? "1px solid #707070"
                                        : "none",
                            }}
                        >
                            <Editor
                                readOnly={
                                    manual.prevent_edit ||
                                    !editorShown ||
                                    isSubmitting
                                }
                                editorStyle={{
                                    minHeight: "15rem",
                                    padding:
                                        !manual.prevent_edit || editorShown
                                            ? "0 0.5rem"
                                            : "0",
                                }}
                                toolbarClassName="toolbarClassName"
                                editorState={content.content}
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={(e) =>
                                    setContent({
                                        ...content,
                                        content: e,
                                    })
                                }
                                toolbarHidden={
                                    manual.prevent_edit || !editorShown
                                }
                            />
                        </Box>
                        {!manual.prevent_edit && editorShown ? (
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit(submit)}
                                >
                                    Save
                                </Button>
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            </Paper>
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

export default ContentView;
