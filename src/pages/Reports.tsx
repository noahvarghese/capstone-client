import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PieChart from "src/components/graphs/PieChart";
import { server } from "src/util/permalink";

const Reports: React.FC = () => {
    const [quizAttempts, setQuizAttempts] = useState<{
        role_details: { id: number; name: string; total_attempts: number }[];
        department_details: {
            id: number;
            name: string;
            total_attempts: number;
        }[];
    }>();

    useEffect(() => {
        const controller = new AbortController();
        fetch(server("/reports/quizzes/attempts"), {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then(setQuizAttempts);

        return () => {
            controller.abort();
        };
    }, []);

    console.log(quizAttempts);

    return (
        <div
            style={{
                minHeight: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "5rem",
                margin: "0 2rem",
            }}
        >
            <Typography variant="h1">Reports</Typography>
            <div
                style={{
                    minHeight: 400,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    alignItems: "flex-start",
                }}
            >
                <PieChart
                    title="Number of attempts at quizzes per role"
                    data={
                        quizAttempts
                            ? quizAttempts.role_details.map((r) => ({
                                  name: r.name,
                                  value: r.total_attempts,
                              }))
                            : []
                    }
                />
                <PieChart
                    title="Number of attempts at quizzes per department"
                    data={
                        quizAttempts
                            ? quizAttempts.department_details.map((d) => ({
                                  name: d.name,
                                  value: d.total_attempts,
                              }))
                            : []
                    }
                />
            </div>
        </div>
    );
};

export default Reports;
