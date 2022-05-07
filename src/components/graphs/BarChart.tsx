import { Box, Typography } from "@mui/material";
import React from "react";
import {
    BarChart as BarGraph,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from "recharts";

interface BarChartProps {
    title: string;
    data: { name: string; value: number }[];
}

const baseColor = "#1976d2";

const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h2" style={{ fontSize: "1.25rem" }}>
                {title}
            </Typography>
            <BarGraph width={400} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                    tickCount={1}
                    max={Math.max(...data.map(({ value }) => value))}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={baseColor} />
            </BarGraph>
        </Box>
    );
};

export default BarChart;
