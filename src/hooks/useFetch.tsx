import { useEffect, useState } from "react";
import { server } from "src/lib/permalink";

const useFetch = <T,>(
    url: string,
    defaultState: T,
    init?: RequestInit | undefined,
    key?: string
): { data: T; handleRefresh: () => void; refreshing: boolean } => {
    const [fetching, setFetching] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState<T>(defaultState);

    useEffect(() => {
        if (!fetching) {
            setFetching(true);

            if (data === defaultState || refresh) {
                const dataWrapper = (d: any) => {
                    setData(key ? d[key as keyof typeof d] : d);
                };

                fetch(server(url), init)
                    .then((res) => res.json())
                    .then(dataWrapper);
            }
            if (refresh) setRefresh(false);
            setFetching(false);
        }
    }, [data, defaultState, fetching, init, key, refresh, url]);

    return {
        data,
        handleRefresh() {
            if (!refresh) setRefresh(true);
        },
        refreshing: refresh,
    };
};

export default useFetch;
