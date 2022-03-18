import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router";
import Confirm from "./Confirmation";

interface AssignmentProps<T> {
    // Plural
    modelName: string;
    toggleRefresh?: () => void;
    hideCondition: (m?: T) => boolean;
    // URL to retrieve the assigned models from
    assignedURL: string;
    // URL to retrieve all of the type of model from
    allURL: string;
    // URL to use to assign/remove models
    assignmentURL: (selected?: T) => string;
    // For the confirmation dialogue
    assignmentDescription: (selected?: T) => string;
    // For the list items
    description: (model: T) => string;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}

const Assignment = <T extends { id: number }>({
    allURL,
    assignedURL,
    assignmentURL,
    assignmentDescription,
    modelName,
    setAlert,
    description,
    hideCondition,
    toggleRefresh,
}: AssignmentProps<T>) => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(true);
    const [assignedModels, setAssignedModels] = useState<T[]>([]);
    const [allModels, setAllModels] = useState<T[]>([]);
    const [selected, setSelected] = useState<T | undefined>();
    const [showAdd, setShowAdd] = useState(false);
    const [showRemove, setShowRemove] = useState(false);

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
                fetch(assignedURL, fetchOptions)
                    .then((res) => {
                        if (res.ok)
                            return res.json().then((d) => setAssignedModels(d));
                        else
                            setAlert({
                                severity: "error",
                                message: `Unable to retrieve assigned ${modelName.toLowerCase()}`,
                            });
                    })
                    .catch((e) => {
                        setAlert({
                            message:
                                (e as Error).message ??
                                `Unable to rerieve assigned ${modelName.toLowerCase()}`,
                        });
                    }),
                fetch(allURL, fetchOptions)
                    .then((res) => {
                        if (res.ok)
                            return res
                                .json()
                                .then(({ data }) => setAllModels(data));
                        else
                            setAlert({
                                severity: "error",
                                message: `Unable to rerieve ${modelName.toLowerCase()}`,
                            });
                    })
                    .catch((e) => {
                        setAlert({
                            message:
                                (e as Error).message ??
                                `Unable to rerieve assigned ${modelName.toLowerCase()}`,
                        });
                    }),
            ]).finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [allURL, assignedURL, modelName, refresh, setAlert]);

    const assignedIds = useMemo(
        () => assignedModels.map((m) => m.id),
        [assignedModels]
    );

    const unassignedModels = useMemo(
        () => allModels.filter((m) => !assignedIds.includes(m.id)),
        [allModels, assignedIds]
    );

    const genListItem = useCallback(
        (direction: "left" | "right") => (model: T) => {
            const icon = (
                <ListItemIcon>
                    <IconButton
                        onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                            e.stopPropagation();
                            setSelected(model);
                            direction === "left"
                                ? setShowAdd(true)
                                : setShowRemove(true);
                        }}
                    >
                        {direction === "left" ? (
                            <ArrowForwardIos />
                        ) : (
                            <ArrowBackIosNew />
                        )}
                    </IconButton>
                </ListItemIcon>
            );

            return (
                <ListItem
                    key={model.id}
                    role="listitem"
                    button
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                    }}
                    onClick={() =>
                        navigate(`/${modelName.toLowerCase()}/${model.id}`)
                    }
                >
                    {direction === "left" ? (
                        <>
                            <ListItemText>{description(model)}</ListItemText>
                            {hideCondition(model) ? icon : null}
                        </>
                    ) : (
                        <>
                            {hideCondition(model) ? icon : null}
                            <ListItemText>{description(model)}</ListItemText>
                        </>
                    )}
                </ListItem>
            );
        },
        [description, hideCondition, modelName, navigate]
    );

    return (
        <Box style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                {modelName[0].toUpperCase()}
                {modelName.substring(1).toLowerCase()}
            </Typography>
            <Box style={{ display: "flex", gap: "5rem" }}>
                <Paper style={{ padding: "1rem 0", width: "25rem" }}>
                    <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                        Available
                    </Typography>
                    <List dense component="div" role="list">
                        {unassignedModels.map(genListItem("left"))}
                    </List>
                </Paper>
                <Paper style={{ padding: "1rem 0", width: "25rem" }}>
                    <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                        Assigned
                    </Typography>
                    <List dense component="div" role="list">
                        {assignedModels.map(genListItem("right"))}
                    </List>
                </Paper>
            </Box>
            <Confirm
                open={showAdd}
                method="POST"
                title="Assign"
                url={assignmentURL(selected)}
                description={assignmentDescription(selected)}
                toggleRefresh={() => {
                    setRefresh(true);
                    if (toggleRefresh) toggleRefresh();
                }}
                setAlert={setAlert}
                onClose={() => {
                    setShowAdd(false);
                    setSelected(undefined);
                }}
            />
            <Confirm
                open={showRemove}
                method="DELETE"
                title="Remove"
                url={assignmentURL(selected)}
                description={assignmentDescription(selected)}
                toggleRefresh={() => {
                    setRefresh(true);
                    if (toggleRefresh) toggleRefresh();
                }}
                setAlert={setAlert}
                onClose={() => {
                    setShowRemove(false);
                    setSelected(undefined);
                }}
            />
        </Box>
    );
};

export default Assignment;
