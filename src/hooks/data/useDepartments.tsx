import React, { useEffect, useState } from "react";
import { Department } from "src/context";
import { server } from "src/util/permalink";

const useDepartments = (
    setAlert: React.Dispatch<
        React.SetStateAction<{
            message: string;
            severity?: "warning" | "error" | "info" | "success" | undefined;
        }>
    >
) => {
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        fetch(server("/departments"), {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then(async (res) => {
                if (res.ok) {
                    try {
                        const { data } = await res.json();
                        setDepartments(data);
                    } catch (e) {
                        const { message } = e as Error;
                        setAlert({ message, severity: "error" });
                    }
                }
            })
            .catch((e) => {
                const { message } = e as Error;
                setAlert({ message, severity: "error" });
            });

        return () => {
            controller.abort();
        };
    }, [setAlert]);

    return departments;
};

export default useDepartments;
