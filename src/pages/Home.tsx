import {
    Alert,
    Box,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "src/components/Loading";
import UpdateMember from "src/components/UpdateMember";
import AppContext, { Member } from "src/context";
import { server } from "src/util/permalink";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { userId, roles: assignedRoles } = useContext(AppContext);
    const [member, setMember] = useState<Member | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/members/${userId}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then((res) =>
                    res.ok
                        ? res.json().then((m) =>
                              setMember({
                                  ...m,
                                  birthday: new Date(Date.parse(m.birthday)),
                              })
                          )
                        : setAlert({
                              message: "Unable to retrieve member details",
                              severity: "error",
                          })
                )
                .catch((e) =>
                    setAlert({
                        message:
                            (e as Error).message ?? "Unable to retrieve data",
                        severity: "error",
                    })
                )
                .finally(() => setRefresh(false));

            return () => controller.abort();
        }
    }, [refresh, userId]);

    if (!member) {
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
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h1">Home</Typography>
                <Typography variant="h2">
                    {member.first_name} {member.last_name}
                </Typography>
                <Box
                    style={{
                        display: "flex",
                        gap: "5rem",
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <UpdateMember
                        setAlert={setAlert}
                        member={member}
                        toggleRefresh={() => setRefresh(true)}
                    />
                    <Paper style={{ padding: "1rem 0", width: "25rem" }}>
                        <Typography variant="h6" variantMapping={{ h6: "h4" }}>
                            Roles Assigned
                        </Typography>
                        <List dense component="div" role="list">
                            {assignedRoles.map((r) => {
                                return (
                                    <ListItem
                                        key={r.id}
                                        role="listitem"
                                        button
                                        style={{
                                            paddingLeft: "2rem",
                                            paddingRight: "2rem",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                        onClick={
                                            assignedRoles.find(
                                                (r) =>
                                                    r.access === "ADMIN" ||
                                                    r.access === "MANAGER"
                                            )
                                                ? () => {
                                                      navigate(
                                                          `/roles/${r.id}`
                                                      );
                                                  }
                                                : undefined
                                        }
                                    >
                                        <ListItemText
                                            primary={`${r.name} <${r.department.name}>`}
                                        />
                                    </ListItem>
                                );
                            })}
                            <ListItem />
                        </List>
                    </Paper>
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

export default Home;
