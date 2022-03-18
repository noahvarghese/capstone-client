import {
    AppBar,
    ThemeProvider,
    Toolbar,
    Typography,
    Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import AppContext, { Role } from "src/context";
import { navTheme } from "src/theme";

const Nav: React.FC = () => {
    const { roles, businesses, userId } = useContext(AppContext);

    let links = (
        <MuiLink
            to="/"
            component={Link}
            style={{ padding: 0, backgroundColor: "transparent" }}
        >
            <Typography variant="h1">Welcome OnBoard</Typography>
        </MuiLink>
    );

    if (userId && businesses.length > 0 && roles.length > 0) {
        if (
            roles.find(
                (r: Role) => r.access === "ADMIN" || r.access === "MANAGER"
            )
        ) {
            links = (
                <>
                    <MuiLink to="/" component={Link}>
                        Home
                    </MuiLink>
                    <MuiLink to="/members" component={Link}>
                        Members
                    </MuiLink>
                    <MuiLink to="/roles" component={Link}>
                        Roles
                    </MuiLink>
                    <MuiLink to="/departments" component={Link}>
                        Departments
                    </MuiLink>
                    <MuiLink to="/manuals" component={Link}>
                        Manuals
                    </MuiLink>
                    <MuiLink to="/quizzes" component={Link}>
                        Quizzes
                    </MuiLink>
                    <MuiLink to="/reports" component={Link}>
                        Reports
                    </MuiLink>
                    <MuiLink to="/logout" component={Link}>
                        Logout
                    </MuiLink>
                </>
            );
        } else {
            links = (
                <>
                    <MuiLink to="/" component={Link}>
                        Home
                    </MuiLink>
                    <MuiLink to="/manuals" component={Link}>
                        Manuals
                    </MuiLink>
                    <MuiLink to="/quizzes" component={Link}>
                        Quizzes
                    </MuiLink>
                    <MuiLink to="/scores" component={Link}>
                        Scores
                    </MuiLink>
                    <MuiLink to="/logout" component={Link}>
                        Logout
                    </MuiLink>
                </>
            );
        }
    }

    return (
        <ThemeProvider theme={navTheme}>
            <AppBar
                style={{
                    height: "4rem",
                    marginBottom: "5rem",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                }}
                position="static"
            >
                <Toolbar>
                    <MuiLink
                        to="/"
                        component={Link}
                        style={{ padding: 0, backgroundColor: "transparent" }}
                    >
                        <div
                            className="imgContainer"
                            style={{ height: "3rem", overflow: "hidden" }}
                        >
                            <img
                                src="/logo.png"
                                alt="logo"
                                style={{ height: "100%" }}
                            />
                        </div>
                    </MuiLink>
                    {links}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Nav;
