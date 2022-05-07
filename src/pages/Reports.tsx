import { Box, Typography, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import BarChart from "src/components/graphs/BarChart";
import PieChart from "src/components/graphs/PieChart";
import { Department, Role } from "src/context";
import { server } from "src/util/permalink";

const Charts: React.FC<{ index: number; active: number }> = ({
    active,
    index,
}) => {
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

    console.log({ index, active });

    return (
        <div
            hidden={active !== index}
            style={{
                display: active === index ? "flex" : "none",
                width: "100%",
                maxWidth: "95vw",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                gap: "5rem",
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
    );
};

const Reports: React.FC = () => {
    const [active, setActive] = useState(0);

    const handleChange = (_: React.ChangeEvent<unknown>, index: number) => {
        console.log(index);
        setActive(index);
    };

    return (
        <div
            style={{
                minHeight: 400,
                width: "100%",
                maxWidth: "95vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "5rem",
                margin: "0 2vw",
            }}
        >
            <Typography variant="h1">Reports</Typography>

            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5rem",
                }}
            >
                <Tabs
                    value={active}
                    onChange={handleChange}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons
                    aria-label="scrollable tabs"
                    style={{ maxWidth: "95vw", zIndex: 3 }}
                >
                    <Tab label="Charts" />
                    <Tab label="Manuals" />
                    <Tab label="Quizzes" />
                </Tabs>
                <Box>
                    <Charts index={0} active={active} />
                    <div hidden={1 !== active}></div>
                </Box>
            </Box>
        </div>
    );
};

export default Reports;
