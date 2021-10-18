import { Paper, Typography } from "@mui/material";
import React from "react";
import "./SingleFormPage.scss";

const SingleFormPage: React.FC<{
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    buttons: JSX.Element[];
}> = ({ children, title, onSubmit, buttons }) => {
    return (
        <div className={`${title.split(" ").join("")} single-form-page`}>
            <Paper elevation={3}>
                <Typography variant="h2">{title}</Typography>
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
        </div>
    );
};

export default SingleFormPage;
