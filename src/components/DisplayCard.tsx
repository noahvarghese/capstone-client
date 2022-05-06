import { Box, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";

interface DisplayCardProps {
    title: string;
    url: string;
    canNavigate?: boolean;
    footer?: string;
}

const DisplayCard: React.FC<DisplayCardProps> = ({
    title,
    url,
    canNavigate = true,
    footer,
}) => {
    const history = useHistory();

    return (
        <Box
            sx={{
                "&:hover": canNavigate
                    ? {
                          boxShadow:
                              "8px 12px 12px rgba(44, 44, 44, 0.25) !important",
                          transform: "scale(1.01)",
                          cursor: "pointer",
                      }
                    : {},
            }}
            style={{
                position: "relative",
                transition: "all 0.15s ease-in-out",
                width: "20rem",
                height: "20rem",
                backgroundColor: "#f3f3f3",
                boxShadow: "4px 8px 8px rgba(44,44,44,0.1)",
                border: "1px solid #eeeeee",
                display: "flex",
                borderRadius: "4px",
                alignItems: "center",
            }}
            onClick={() => {
                if (canNavigate) {
                    history.push(url);
                }
            }}
        >
            <Typography
                variant="h2"
                style={{
                    padding: "1rem",
                    textAlign: "left",
                    width: "100%",
                    borderBottom: "5px solid #1976d2",
                }}
            >
                {title}
            </Typography>
            {footer ? (
                <Box
                    style={{
                        color: "rgb(111, 126, 140)",
                        position: "absolute",
                        right: "1rem",
                        bottom: "1rem",
                    }}
                >
                    {footer}
                </Box>
            ) : null}
        </Box>
    );
};

export default DisplayCard;
