import { createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";

const theme = createTheme({
    typography: {
        allVariants: {
            textDecoration: "none",
        },
        h1: {
            fontFamily: "Montserrat",
            fontSize: "3rem",
        },
        h2: {
            fontFamily: "Montserrat",
            fontSize: "2rem",
        },
        h3: {
            fontFamily: "Montserrat",
        },
        h4: { fontFamily: "Montserrat" },
        h5: {
            fontFamily: "Montserrat",
        },
        h6: {
            fontFamily: "Montserrat",
        },
        body1: {
            fontFamily: "Roboto",
            fontWeight: 300,
        },
        body2: {
            fontFamily: "Roboto",
            fontWeight: 500,
            textDecoration: "none",
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: "none",
                    color: "black",
                    ":visited": {
                        color: "black",
                    },
                    transition: "0.3s ease all",
                    ":hover": { color: blue[300] },
                },
            },
        },
    },
});

export const navTheme = createTheme({
    typography: theme.typography,
    components: {
        MuiToolbar: {
            styleOverrides: {
                root: {
                    justifyContent: "space-between",
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: "white",
                    padding: "1rem 2rem",
                    transition: "color 0.3s ease, background-color 0.5s ease",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    fontSize: "1.2rem",
                    fontWeight: 300,
                    ":visited": {
                        color: "white",
                    },
                    ":hover": {
                        backgroundColor: blue[500],
                    },
                },
            },
        },
    },
});

export default theme;
