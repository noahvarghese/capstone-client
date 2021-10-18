import { useCallback } from "react";
import { server } from "src/lib/permalink";

const usePost = (url: string) => {
    const submit = useCallback(
        async (data: unknown): Promise<any> => {
            const res = await fetch(server(url), {
                body: JSON.stringify(data),
                method: "POST",
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
                console.error(status);
                const data = await res.json();
                throw new Error(data?.message ?? status);
            }
        },
        [url]
    );

    return { submit };
};

export default usePost;
