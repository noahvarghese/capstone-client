import React, { useEffect, useState } from "react";
import { Manual } from "src/pages/ManualsList";
import { server } from "src/util/permalink";

const useManuals = (
    setAlert: React.Dispatch<
        React.SetStateAction<{
            message: string;
            severity?: "warning" | "error" | "info" | "success" | undefined;
        }>
    >
) => {
    const [manuals, setManuals] = useState<Manual[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        fetch(server("/manuals"), {
            method: "GET",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then(async (res) => {
                if (res.ok) {
                    try {
                        const { data } = await res.json();
                        setManuals(data);
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

    return manuals;
};

export default useManuals;
