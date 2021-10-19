import { useEffect, useState } from "react";
import { server } from "src/lib/permalink";

const useFetch = <T,>(
    url: string,
    init?: RequestInit | undefined,
    key?: string
): T[] => {
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        if (data.length === 0) {
            const dataWrapper = (d: any) => {
                setData(d[key as keyof typeof d]);
            };

            fetch(server(url), init)
                .then((res) => res.json())
                .then(dataWrapper);
        }
    }, [data.length, init, key, url]);

    return data;
};

export default useFetch;
