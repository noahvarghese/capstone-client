import { useCallback } from "react";
import { server } from "src/util/permalink";

const useDelete = <T,>(url: string) => {
    const deleteFn = useCallback(
        async (data: T): Promise<void> => {
            let queryString = "/?";
            for (const [key, value] of Object.entries(data)) {
                queryString += `${key}=${JSON.stringify(value)}&`;
            }
            queryString = queryString.substring(0, queryString.length - 1);

            const res = await fetch(server(url + queryString), {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                try {
                    return await res.json();
                } catch (_) {
                    return;
                }
            } else {
                const status = `Status: ${res.status} ${res.statusText}`;
                const data = await res.json();
                throw new Error(data?.message ?? status);
            }
        },
        [url]
    );

    return { deleteFn };
};

export default useDelete;
