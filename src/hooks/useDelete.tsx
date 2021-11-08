import { useCallback } from "react";
import { server } from "src/util/permalink";

const useDelete = <T,>(url: string) => {
    const deleteFn = useCallback(
        async (data: T): Promise<void> => {
            const res = await fetch(server(url), {
                body: JSON.stringify(data),
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
