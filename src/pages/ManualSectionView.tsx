import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
    Link as MuiLink,
    Alert,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Table,
    TableBody,
} from "@mui/material";
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Loading from "src/components/Loading";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";
import { Delete } from "@mui/icons-material";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Confirm from "src/components/Confirmation";

const CreateContent: React.FC<{
    manual: Manual;
    toggleRefresh: () => void;
    manualSection: ManualSection;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ manual, manualSection, setAlert, toggleRefresh }) => {
    const [editor, setEditor] = useState(EditorState.createEmpty());
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

    const submit = useCallback(
        (data) => {
            fetch(server(`/manuals/sections/${manualSection.id}/contents`), {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    ...data,
                    content: convertToRaw(editor.getCurrentContent()),
                }),
                mode: "cors",
            })
                .then(async (res) => {
                    if (res.ok) {
                        reset({ title: "" });
                        setEditor(EditorState.createEmpty());
                        setAlert({
                            severity: "success",
                            message: `Succesfully created content for ${manual.title}: ${manualSection.title}`,
                        });
                        toggleRefresh();
                    } else {
                        setAlert({
                            severity: "error",
                            message:
                                (await res.text()) ??
                                `Error creating content for ${manual.title}: ${manualSection.title}`,
                        });
                    }
                })
                .catch((e) => {
                    setAlert({
                        severity: "error",
                        message:
                            (e as Error).message ??
                            `Error creating content for ${manual.title}: ${manualSection.title}`,
                    });
                });
        },
        [
            editor,
            manual.title,
            manualSection.id,
            manualSection.title,
            reset,
            setAlert,
            toggleRefresh,
        ]
    );

    return (
        <Paper
            style={{
                height: "min-content",
                minHeight: "25rem",
                maxWidth: "35%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                Create
            </Typography>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    flexGrow: 3,
                    margin: "0.5rem 1rem",
                }}
                onSubmit={handleSubmit(submit)}
            >
                <TextField
                    {...register("title", {
                        required: "title cannot be empty",
                    })}
                    label="title"
                    id="name"
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    type="text"
                    value={watch("title", "")}
                    placeholder="title"
                    required
                    disabled={manual.prevent_edit || isSubmitting}
                />
                <Box
                    style={{
                        borderRadius: "4px",
                    }}
                >
                    <Editor
                        readOnly={manual.prevent_edit || isSubmitting}
                        editorStyle={{
                            minHeight: "15rem",
                            padding: "0 0.5rem",
                        }}
                        toolbarClassName="toolbarClassName"
                        editorState={editor}
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={setEditor}
                    />
                </Box>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="reset"
                        disabled={manual.prevent_edit || isSubmitting}
                        variant="outlined"
                        onClick={() => {
                            reset({
                                title: "",
                            });
                            setEditor(EditorState.createEmpty());
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={manual.prevent_edit || isSubmitting}
                    >
                        Create
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export interface Content {
    id: number;
    title: string;
    content: any;
}

const ContentView: React.FC<{
    manual: Manual;
    manualSection: ManualSection;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ manual, manualSection, setAlert }) => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(true);
    const [contents, setContents] = useState<Content[]>([]);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState<Content | undefined>();

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/manuals/sections/${manualSection.id}/contents`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            setContents(await res.json());
                        } catch (e) {
                            const { message } = e as Error;
                            setAlert({ message, severity: "error" });
                        }
                        return;
                    }
                    setAlert({
                        message: "Unable to load roles",
                        severity: "error",
                    });
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                })
                .finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [manualSection.id, refresh, setAlert]);

    return (
        <Box
            style={{
                display: "flex",
                gap: "2rem",
            }}
        >
            <CreateContent
                toggleRefresh={() => setRefresh(true)}
                manual={manual}
                manualSection={manualSection}
                setAlert={setAlert}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>title</TableCell>
                            {!manual.prevent_edit ? (
                                <TableCell></TableCell>
                            ) : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contents.map((c) => (
                            <TableRow
                                key={c.id}
                                hover
                                onClick={() =>
                                    navigate(
                                        `/manuals/${manual.id}/sections/${manualSection.id}/contents/${c.id}`
                                    )
                                }
                            >
                                <TableCell>{c.title}</TableCell>
                                {!manual.prevent_edit ? (
                                    <TableCell>
                                        <Button
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(c);
                                                setShowDelete(true);
                                            }}
                                        >
                                            <Delete />
                                        </Button>
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Confirm
                    description={`${selected?.title}`}
                    method="DELETE"
                    title="Delete"
                    onClose={() => {
                        setShowDelete(false);
                        setSelected(undefined);
                    }}
                    open={showDelete}
                    setAlert={setAlert}
                    toggleRefresh={() => setRefresh(true)}
                    url={server(`/manuals/sections/contents/${selected?.id}`)}
                />
            </TableContainer>
        </Box>
    );
};

const UpdateManualSection: React.FC<{
    manualSection: ManualSection;
    manual: Manual;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ manualSection, manual, toggleRefresh, setAlert }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
        defaultValues: { title: manualSection?.title },
    });

    const submit = useCallback(
        (data) => {
            fetch(server(`/manuals/sections/${manualSection.id}`), {
                method: "PUT",
                body: JSON.stringify(data),
                credentials: "include",
                mode: "cors",
            })
                .then((res) => {
                    if (res.ok) {
                        toggleRefresh();
                        reset({ title: "" });
                        return;
                    } else {
                        setAlert({
                            message: `Unable to update manual section: ${manualSection.title}`,
                            severity: "error",
                        });
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                });
        },
        [manualSection.id, manualSection.title, reset, setAlert, toggleRefresh]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                Update Section
            </Typography>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <TextField
                    style={{ margin: "0.5rem 0" }}
                    {...register("title", {
                        required: "title cannot be empty",
                    })}
                    label="title"
                    id="name"
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    type="text"
                    value={watch("title", "")}
                    placeholder="title"
                    required
                    disabled={manual.prevent_edit || isSubmitting}
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
                        disabled={manual.prevent_edit || isSubmitting}
                        onClick={() => reset()}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={manual.prevent_edit || isSubmitting}
                        onClick={handleSubmit(submit)}
                        variant="contained"
                    >
                        Update
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export interface ManualSection {
    id: number;
    title: string;
}

const ManualSectionView = () => {
    const { id, manual_id } = useParams();
    const [manual, setManual] = useState<Manual | undefined>();
    const [manualSection, setManualSection] = useState<
        ManualSection | undefined
    >();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();
            const fetchOptions: RequestInit = {
                mode: "cors",
                signal: controller.signal,
                method: "GET",
                credentials: "include",
            };

            Promise.all([
                fetch(server(`/manuals/${manual_id}`), fetchOptions).then(
                    async (res) => {
                        try {
                            if (res.ok) {
                                const r = await res.json();
                                setManual(r);
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
                                (await res.text()) ??
                                "Unable to retrieve manual",
                            severity: "error",
                        });
                    }
                ),
                fetch(server(`/manuals/sections/${id}`), fetchOptions).then(
                    async (res) => {
                        try {
                            if (res.ok) {
                                const r = await res.json();
                                setManualSection(r);
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
                                (await res.text()) ??
                                "Unable to retrieve manual section",
                            severity: "error",
                        });
                    }
                ),
            ])
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
    }, [id, manual_id, refresh]);

    if (!manual || !manualSection) {
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
            <Typography variant="h1">Manual Section</Typography>
            <Typography variant="h2">
                {manual.title}
                {": "}
                {manualSection.title}
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
                        justifyContent: "center",
                        gap: "2rem",
                    }}
                >
                    <UpdateManualSection
                        manual={manual}
                        manualSection={manualSection}
                        toggleRefresh={() => setRefresh(true)}
                        setAlert={setAlert}
                    />
                    <List>
                        <MuiLink to={`/manuals/${manual.id}`} component={Link}>
                            <ListItem>
                                <ListItemText
                                    primary="manual title"
                                    secondary={manual.title}
                                />
                            </ListItem>
                        </MuiLink>
                        <ListItem>
                            <ListItemText
                                primary="section title"
                                secondary={manualSection.title}
                            />
                        </ListItem>
                    </List>
                </Box>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2rem",
                    }}
                >
                    <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                        Contents
                    </Typography>
                    <ContentView
                        setAlert={setAlert}
                        manual={manual}
                        manualSection={manualSection}
                    />
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
            </Box>
        </div>
    );
};

export default ManualSectionView;
