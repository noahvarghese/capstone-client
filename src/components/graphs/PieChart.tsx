import { Box, Typography } from "@mui/material";
import React from "react";
import { PieChart as PieGraph, Pie, Cell } from "recharts";
import { selectColor } from "src/util/colors";

interface PieChartProps {
    title: string;
    data: { name: string; value: number }[];
}

const baseColor = "1976d2";

const renderLabel = (entry: Required<{ name: string; value: number }>) => {
    return `${entry.name} - ${entry.value}`;
};

class PieChart extends React.PureComponent<PieChartProps, {}> {
    render() {
        const { title, data } = this.props;

        return (
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h2" style={{ fontSize: "1.25rem" }}>
                    {title}
                </Typography>
                <PieGraph width={400} height={400}>
                    <Pie
                        isAnimationActive={false}
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={80}
                        nameKey="name"
                        fill={baseColor}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={selectColor(index)}
                            />
                        ))}
                    </Pie>
                </PieGraph>
            </Box>
        );
    }
}

export default PieChart;
