import { Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { useEffect, useState } from "react";

const Loading: React.FC = () => {
    const [ellipses, setEllipses] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setEllipses(ellipses < 3 ? ellipses + 1 : 0);
        }, 700);
        return () => clearInterval(interval);
    });

    return (
        <div
            className="Loading"
            style={{
                margin: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: blue[300],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
            }}
        >
            <Typography
                variant="h1"
                style={{ fontFamily: "Montserrat", fontSize: "3rem" }}
            >
                Loading{".".repeat(ellipses)}
            </Typography>
        </div>
    );
};

export default Loading;
