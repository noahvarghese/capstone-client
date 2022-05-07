import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BarChart from "src/components/graphs/BarChart";
import PieChart from "src/components/graphs/PieChart";
import { Department, Role } from "src/context";
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
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchOptions: RequestInit = {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        };

        Promise.all([
            fetch(server("/reports/quizzes/attempts"), fetchOptions)
                .then((res) => res.json())
                .then(setQuizAttempts),
            fetch(server("/departments"), fetchOptions)
                .then((res) => res.json())
                .then(({ data }) => data)
                .then(setDepartments),
            fetch(server("/roles"), fetchOptions)
                .then((res) => res.json())
                .then(({ data }) => data)
                .then(setRoles),
        ]);

        return () => {
            controller.abort();
        };
    }, []);

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
                <BarChart
                    title="Number of employees per department"
                    data={departments.map((d) => ({
                        name: d.name,
                        value: d.num_members,
                    }))}
                />
                <BarChart
                    title="Number of employees per role"
                    data={roles.map((r) => ({
                        name: r.name,
                        value: r.num_members,
                    }))}
                />
                <BarChart
                    title="Number of managers per department"
                    data={departments.map((d) => ({
                        name: d.name,
                        value: d.num_managers,
                    }))}
                />
            </div>
        </div>
    );
};

export default Reports;
