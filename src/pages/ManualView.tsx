import {
    Box,
    Typography,
    Alert,
    Paper,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    List,
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import Assignment from "src/components/Assignment";
import Loading from "src/components/Loading";
import { Role } from "src/context";
import { server } from "src/util/permalink";
import { Manual } from "./ManualsList";
import { Delete } from "@mui/icons-material";
import Confirm from "src/components/Confirmation";

const AddSection: React.FC<{
    manual: Manual;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ manual, toggleRefresh, setAlert }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all", defaultValues: { title: "" } });

    const submit = useCallback(
        (data) => {
            fetch(server(`/manuals/${manual.id}/sections`), {
                method: "POST",
                body: JSON.stringify(data),
                credentials: "include",
            })
                .then((res) => {
                    if (res.ok) {
                        toggleRefresh();
                        reset({ title: "" });
                        return;
                    } else {
                        setAlert({
                            message: "Unable to add manual section",
                            severity: "error",
                        });
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                });
        },
        [manual.id, reset, setAlert, toggleRefresh]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                Add Section
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
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={manual.prevent_edit || isSubmitting}
                        onClick={handleSubmit(submit)}
                    >
                        Create
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

const UpdateManual: React.FC<{
    manual: Manual;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
    toggleRefresh: () => void;
}> = ({ manual, setAlert, toggleRefresh }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        mode: "all",
    });

    useEffect(() => {
        reset({
            title: manual.title,
            prevent_edit: manual.prevent_edit,
            prevent_delete: manual.prevent_delete,
            published: manual.published,
        });
    }, [
        manual.prevent_delete,
        manual.prevent_edit,
        manual.published,
        manual.title,
        reset,
    ]);

    const submit = useCallback(
        async (data) => {
            await fetch(server(`/manuals/${manual.id}`), {
                body: JSON.stringify({
                    ...data,
                    prevent_edit:
                        typeof data.prevent_edit === "string"
                            ? data.prevent_edit === "true"
                            : data.prevent_edit,
                    prevent_delete:
                        typeof data.prevent_delete === "string"
                            ? data.prevent_delete === "true"
                            : data.prevent_delete,
                    published:
                        typeof data.published === "string"
                            ? data.published === "true"
                            : data.published,
                }),
                method: "PUT",
                credentials: "include",
                mode: "cors",
            }).then(async (res) => {
                if (res.ok) {
                    setAlert({
                        message: `Updated manual: ${data.title}`,
                        severity: "success",
                    });
                    toggleRefresh();
                } else {
                    setAlert({
                        message: `Unable to update manual: ${data.title}`,
                        severity: "error",
                    });
                }
            });
        },
        [manual.id, toggleRefresh, setAlert]
    );

    return (
        <Paper style={{ padding: "1rem", height: "min-content" }}>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Update Manual
            </Typography>
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
                    value={watch("title", "")}
                    required
                    disabled={manual.prevent_edit || isSubmitting}
                />
                <FormControlLabel
                    checked={Boolean(watch("prevent_edit"))}
                    control={
                        <Checkbox {...register("prevent_edit")} value={true} />
                    }
                    label="prevent edit"
                />
                <FormControlLabel
                    checked={Boolean(watch("prevent_delete"))}
                    control={
                        <Checkbox
                            {...register("prevent_delete")}
                            disabled={manual.prevent_edit}
                            value={true}
                        />
                    }
                    label="prevent delete"
                />
                <FormControlLabel
                    checked={Boolean(watch("published"))}
                    control={
                        <Checkbox
                            {...register("published")}
                            value={true}
                            disabled={manual.prevent_edit}
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
                        onClick={() => {
                            reset({
                                title: manual.title,
                                prevent_edit: manual.prevent_edit,
                                prevent_delete: manual.prevent_delete,
                                published: manual.published,
                            });
                        }}
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

const ManualView = () => {
    const { id } = useParams();
    const [manual, setManual] = useState<Manual | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/manuals/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
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

    if (!manual) {
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
            <Typography variant="h1">Manual</Typography>
            <Typography variant="h2">{manual.title}</Typography>
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
                    <UpdateManual
                        toggleRefresh={() => setRefresh(true)}
                        manual={manual}
                        setAlert={setAlert}
                    />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="title"
                                secondary={manual.title}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent edit"
                                secondary={manual.prevent_edit.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="prevent delete"
                                secondary={manual.prevent_delete.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="published"
                                secondary={manual.published.toString()}
                            />
                        </ListItem>
                    </List>
                </Box>
                <Assignment
                    modelName="roles"
                    hideCondition={() => true}
                    allURL={`${server("/roles")}`}
                    assignedURL={server(`/manuals/${manual.id}/roles`)}
                    assignmentURL={(r?: Role) =>
                        `${server(`/manuals/${manual.id}/roles/${r?.id}`)}`
                    }
                    description={(r: Role) =>
                        `${r.name} <${r.department.name}>`
                    }
                    assignmentDescription={(r?: Role) =>
                        `manual ${manual.title} to role: ${r?.name} <${r?.department.name}>`
                    }
                    setAlert={setAlert}
                />
                <ManualSectionDisplay manual={manual} setAlert={setAlert} />
                {/*
                 * TODO: Add create Quiz table with delete and clickable rows
                 */}
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

interface ManualSection {
    id: number;
    title: string;
}

const ManualSectionDisplay: React.FC<{
    manual: Manual;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}> = ({ manual, setAlert }) => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(true);
    const [sections, setSections] = useState<ManualSection[]>([]);
    const [selected, setSelected] = useState<ManualSection | undefined>();
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/manuals/${manual.id}/sections`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        try {
                            setSections(await res.json());
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
    }, [manual.id, refresh, setAlert]);

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
            }}
        >
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                Sections
            </Typography>
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
                }}
            >
                <AddSection
                    manual={manual}
                    setAlert={setAlert}
                    toggleRefresh={() => setRefresh(true)}
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
                            {sections.map((s) => (
                                <TableRow
                                    key={s.id}
                                    hover={true}
                                    onClick={() => {
                                        navigate(
                                            `/manuals/${manual.id}/sections/${s.id}`
                                        );
                                    }}
                                >
                                    <TableCell>{s.title}</TableCell>
                                    {!manual.prevent_edit ? (
                                        <TableCell>
                                            <Button
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelected(s);
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
                </TableContainer>
            </Box>
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
                url={server(`/manuals/sections/${selected?.id}`)}
                toggleRefresh={() => setRefresh(true)}
            />
        </Box>
    );
};

export default ManualView;
