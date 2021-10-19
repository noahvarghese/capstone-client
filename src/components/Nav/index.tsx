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
}> = ({ links }) => {
    return (
        <ThemeProvider theme={navTheme}>
            <AppBar style={{ height: "4rem" }} position="static">
                <Toolbar>
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
                    {links.length > 0 ? (
                        <div className="links">
                            {links.map((link) => (
                                <Link key={link.name} href={link.path}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Typography variant="h1">Welcome OnBoard</Typography>
                    )}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Nav;
