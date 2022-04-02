import { Person } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Link as MuiLink,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Assignment from "src/components/Assignment";
import Loading from "src/components/Loading";
import UpdateMember from "src/components/UpdateMember";
import AppContext, { Member, Role } from "src/context";
import { server } from "src/util/permalink";

const MemberView = () => {
    const { id } = useParams<{ id?: string }>();
    const { userId } = useContext(AppContext);
    const [member, setMember] = useState<Member | undefined>();
    const [refresh, setRefresh] = useState(true);
    const [alert, setAlert] = useState<{
        message: string;
        severity?: "warning" | "error" | "info" | "success";
    }>({ message: "" });

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(server(`/members/${id}`), {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        const r = await res.json();
                        setMember({
                            ...r,
                            birthday: new Date(Date.parse(r.birthday)),
                        });
                        return;
                    } else {
                        setAlert({
                            message:
                                (await res.text()) ??
                                "Unable to retrieve member",
                            severity: "error",
                        });
                    }
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

    const inviteMember = useCallback(async () => {
        await fetch(server("/members/invite"), {
            body: JSON.stringify({
                email: member?.email ?? "",
                phone: member?.phone ?? "",
            }),
            method: "POST",
            credentials: "include",
            mode: "cors",
        }).then(async (res) => {
            if (res.ok) {
                setAlert({
                    message: `Sent invitation to: ${member?.email ?? ""}`,
                    severity: "success",
                });
            } else {
                setAlert({
                    message: `Unable to invite user ${member?.email ?? ""}`,
                    severity: "error",
                });
            }
        });
    }, [member?.email, member?.phone]);

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
            <Typography variant="h1">Member</Typography>
            <Typography variant="h2">
                {member.first_name} {member.last_name}
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
                    {userId === Number(id) ? (
                        <UpdateMember
                            setAlert={setAlert}
                            member={member}
                            triggerRefresh={() => setRefresh(true)}
                        />
                    ) : (
                        <Paper
                            style={{
                                width: "20rem",
                                height: "20rem",
                                borderRadius: "50%",
                                backgroundColor: "rgba(44,44,44,0.2)",
                                border: "5px solid #333333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Person style={{ width: "75%", height: "75%" }} />
                        </Paper>
                    )}
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="name"
                                secondary={`${member.first_name} ${member.last_name}`}
                            />
                        </ListItem>
                        <MuiLink
                            href={`mailto:${member.email}`}
                            component={"a"}
                        >
                            <ListItem>
                                <ListItemText
                                    primary="email"
                                    secondary={member.email}
                                />
                            </ListItem>
                        </MuiLink>
                        {member.phone ? (
                            <MuiLink
                                href={`tel:${member.phone}`}
                                component={"a"}
                            >
                                <ListItem>
                                    <ListItemText
                                        primary="phone"
                                        secondary={member.phone}
                                    />
                                </ListItem>
                            </MuiLink>
                        ) : (
                            <ListItem>
                                <ListItemText
                                    primary="phone"
                                    secondary={member.phone}
                                />
                            </ListItem>
                        )}
                        <ListItem>
                            <ListItemText
                                primary="birthday"
                                secondary={(() => {
                                    if (
                                        member.birthday?.toString() ===
                                        "Invalid Date"
                                    )
                                        return "";
                                    const bday = member.birthday as Date;
                                    const year = bday.getFullYear();
                                    const month = bday.getMonth() + 1;
                                    const day = bday.getDate();
                                    const set = `${
                                        month.toString().length === 1
                                            ? `0${month}`
                                            : month
                                    }/${
                                        day.toString().length === 1
                                            ? `0${day}`
                                            : day
                                    }/${year}`;
                                    return set;
                                })()}
                            />
                        </ListItem>
                        <ListItem style={{ display: "flex", gap: "1rem" }}>
                            <ListItemText
                                primary="membership accepted"
                                secondary={member.accepted ? "true" : "false"}
                            />
                            {!member.accepted ? (
                                <Button
                                    onClick={inviteMember}
                                    style={{ padding: "1rem" }}
                                >
                                    Resend Invitation
                                </Button>
                            ) : null}
                        </ListItem>
                    </List>
                </Box>
                <Assignment
                    modelName="roles"
                    hideCondition={() => member.id !== userId}
                    allURL={server("/roles")}
                    assignedURL={server(`/members/${member.id}/roles`)}
                    assignmentURL={(r?: Role) =>
                        server(`/members/${member.id}/roles/${r?.id}`)
                    }
                    description={(r: Role) =>
                        `${r.name} <${r.department.name}>`
                    }
                    assignmentDescription={(r?: Role) =>
                        `member ${member.first_name} ${member.last_name} <${member.email}> to role: ${r?.name} <${r?.department.name}>`
                    }
                    setAlert={setAlert}
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
        </div>
    );
};

export default MemberView;
