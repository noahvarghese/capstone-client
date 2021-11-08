import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import "./SingleFormPage.scss";

const SingleFormPage: React.FC<{
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    buttons: JSX.Element[];
    titleVariant?: "h1" | "h2" | "h3";
}> = ({ children, title, onSubmit, buttons, titleVariant = "h2" }) => {
    return (
        <Box className={`${title.split(" ").join("")} single-form-page`}>
            <Paper elevation={3}>
                <Typography variant={titleVariant}>{title}</Typography>
                <form onSubmit={onSubmit}>
                    {children}
                    <div
                        className={`${
                            buttons.length > 1 ? "multiple " : ""
                        }btn-container`}
                    >
                        {buttons}
                    </div>
                </form>
            </Paper>
        </Box>
    );
};

export default SingleFormPage;
