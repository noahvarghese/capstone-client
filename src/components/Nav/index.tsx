import {
    AppBar,
    Link,
    ThemeProvider,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";
import { navTheme } from "src/theme";

const Nav: React.FC<{
    links: { name: string; path: string }[];
    auth: boolean;
}> = ({ links, auth }) => {
    return (
        <ThemeProvider theme={navTheme}>
            <AppBar style={{ height: "4rem" }} position="static">
                <Toolbar>
                    <div
                        className="imgContainer"
                        style={{ height: "3rem", overflow: "hidden" }}
                    >
                        <img
                            src="/logo_1.png"
                            alt="logo"
                            style={{ height: "100%" }}
                        />
                    </div>
                    {!auth && (
                        <Typography variant="h1">Welcome OnBoard</Typography>
                    )}
                    {auth && (
                        <div className="links">
                            {links?.map((link) => (
                                <Link key={link.name} href={link.path}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Nav;
