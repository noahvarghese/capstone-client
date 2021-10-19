import { useEffect, useState } from "react";
import { server } from "src/lib/permalink";

const useFetch = <T,>(
    url: string,
    init?: RequestInit | undefined,
    key?: string
): { data: T[]; handleRefresh: () => void; refreshing: boolean } => {
    const [fetching, setFetching] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        if (!fetching) {
            setFetching(true);

            if (data.length === 0 || refresh) {
                const dataWrapper = (d: any) => {
                    setData(d[key as keyof typeof d]);
                };

                fetch(server(url), init)
                    .then((res) => res.json())
                    .then(dataWrapper);
            }
            if (refresh) setRefresh(false);
            setFetching(false);
        }
    }, [data.length, fetching, init, key, refresh, url]);

    console.log(data);
    return {
        data,
        handleRefresh() {
            if (!refresh) setRefresh(true);
        },
        refreshing: refresh,
    };
};

export default useFetch;
