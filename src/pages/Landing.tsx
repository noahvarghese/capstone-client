import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Link as MuiLink,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
    return (
        <Box
            style={{
                gap: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                style={{
                    gap: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "50rem",
                }}
            >
                <Typography variant="h1">Welcome OnBoard</Typography>
                <Typography variant="body1">
                    This is{" "}
                    <MuiLink to="noahvarghese.me" component={Link}>
                        Noah Varghese's
                    </MuiLink>{" "}
                    capstone project to conclude his studies in Mohawk College's
                    Software Development program. It was built to be a paperless
                    employee onboarding system. The features it supports are:
                </Typography>
                <List>
                    <ListItem style={{ textAlign: "center" }}>
                        <ListItemText>User management</ListItemText>
                    </ListItem>
                    <ListItem style={{ textAlign: "center" }}>
                        <ListItemText>
                            Role-based access control (RBAC)
                        </ListItemText>
                    </ListItem>
                    <ListItem style={{ textAlign: "center" }}>
                        <ListItemText>
                            'Manual' creation via markdown
                        </ListItemText>
                    </ListItem>
                    <ListItem style={{ textAlign: "center" }}>
                        <ListItemText>Quiz creation</ListItemText>
                    </ListItem>
                    <ListItem style={{ textAlign: "center" }}>
                        <ListItemText>Quiz taking</ListItemText>
                    </ListItem>
                    <ListItem style={{ textAlign: "center" }}>
                        <ListItemText>Report generation</ListItemText>
                    </ListItem>
                </List>
                <List
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ListItem
                        style={{
                            width: "10rem",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MuiLink href="/login" variant="button">
                            <Button
                                variant="outlined"
                                style={{ width: "10rem" }}
                            >
                                Login
                            </Button>
                        </MuiLink>
                    </ListItem>
                    <ListItem
                        style={{
                            width: "10rem",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MuiLink href="/register">
                            <Button
                                variant="contained"
                                style={{ width: "10rem" }}
                            >
                                Register
                            </Button>
                        </MuiLink>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default Landing;
