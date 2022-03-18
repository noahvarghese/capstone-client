import React, { useEffect, useState } from "react";
import { Role } from "src/context";
import { server } from "src/util/permalink";

const useRoles = (
    setAlert: React.Dispatch<
        React.SetStateAction<{
            message: string;
            severity?: "warning" | "error" | "info" | "success" | undefined;
        }>
    >
) => {
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        fetch(server("/roles"), {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then(async (res) => {
                if (res.ok) {
                    try {
                        const { data } = await res.json();
                        setRoles(data);
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

    return roles;
};

export default useRoles;
