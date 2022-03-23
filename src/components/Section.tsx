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
    Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { capitalizeFirstLetter } from "src/util/string";
import Confirm from "./Confirmation";
import DynamicForm from "./DynamicForm";

export interface Section {
    id: number;
    title: string;
}

interface SectionDisplayProps<T> {
    parent: T;
    parentName: string;
    viewSectionUrl: (id: number) => string;
    getUrl: string;
    postUrl: string;
    deleteUrl: (id?: number) => string;
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
                <DynamicForm
                    title={`Add ${capitalizeFirstLetter(parentName)} Section`}
                    url={postUrl}
                    fetchOptions={{
                        method: "POST",
                        credentials: "include",
                        mode: "cors",
                    }}
                    formOptions={{
                        title: {
                            defaultValue: "",
                            label: "title",
                            type: "input",
                            inputType: "text",
                            registerOptions: {
                                disabled: parent.prevent_edit,
                                required: "title cannot be empty",
                            },
                        },
                    }}
                    setAlert={setAlert}
                    triggerRefresh={() => setRefresh(true)}
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
