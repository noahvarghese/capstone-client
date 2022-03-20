import { Delete } from "@mui/icons-material";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Confirm from "./Confirmation";

export interface Section {
    id: number;
    title: string;
}

interface AddSectionProps<T> {
    parent: T;
    parentName: string;
    url: string;
    toggleRefresh: () => void;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}

const Add = <T extends { prevent_edit: boolean }>({
    parent,
    parentName,
    url,
    toggleRefresh,
    setAlert,
}: AddSectionProps<T>) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "all", defaultValues: { title: "" } });

    const submit = useCallback(
        (data) => {
            fetch(url, {
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
                            message: `Unable to add ${parentName} section`,
                            severity: "error",
                        });
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    setAlert({ message, severity: "error" });
                });
        },
        [parentName, reset, setAlert, toggleRefresh, url]
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
                    disabled={parent.prevent_edit || isSubmitting}
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
                        disabled={parent.prevent_edit || isSubmitting}
                        onClick={() => reset()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={parent.prevent_edit || isSubmitting}
                        onClick={handleSubmit(submit)}
                    >
                        Create
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

interface SectionDisplayProps<T> {
    parent: T;
    parentName: string;
    viewSectionUrl: (id: number) => string;
    getUrl: string;
    postUrl: string;
    deleteUrl: (id?: number) => string;
    // Same url for get and post
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}

const SectionDisplay = <T extends { prevent_edit: boolean }>({
    parent,
    parentName,
    getUrl,
    postUrl,
    deleteUrl,
    viewSectionUrl,
    setAlert,
}: SectionDisplayProps<T>) => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [selected, setSelected] = useState<Section | undefined>();
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(getUrl, {
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
    }, [getUrl, refresh, setAlert]);

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
                <Add
                    url={postUrl}
                    parent={parent}
                    parentName={parentName}
                    setAlert={setAlert}
                    toggleRefresh={() => setRefresh(true)}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>title</TableCell>
                                {!parent.prevent_edit ? (
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
                                        navigate(viewSectionUrl(s.id));
                                    }}
                                >
                                    <TableCell>{s.title}</TableCell>
                                    {!parent.prevent_edit ? (
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
                url={deleteUrl(selected?.id)}
                toggleRefresh={() => setRefresh(true)}
            />
        </Box>
    );
};

export default SectionDisplay;
