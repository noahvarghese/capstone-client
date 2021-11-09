import { useCallback, useEffect, useReducer } from "react";
import { server } from "src/util/permalink";

interface FetchHookResult<T> {
    data: T;
    handleRefresh: () => void;
    isRefreshing: boolean;
}

interface State<T> {
    isRefreshing: boolean;
    data: T;
}
const reducer = <T,>(
    state: State<T>,
    action: { payload?: unknown; type: "SET_DATA" | "REFRESH" }
) => {
    switch (action.type) {
        case "SET_DATA":
            return { data: action.payload, isRefreshing: false };
        case "REFRESH":
            return { data: state.data, isRefreshing: true };
        default:
            throw new Error("Invalid action");
    }
};

const useFetch = <T,>(
    url: string,
    defaultState: T,
    init?: RequestInit | undefined,
    key?: string
): FetchHookResult<T> => {
    const [{ data, isRefreshing }, dispatch] = useReducer(reducer, {
        data: defaultState,
        isRefreshing: true,
    });

    const handleRefresh = useCallback(
        () => dispatch({ type: "REFRESH" }),
        [dispatch]
    );

    useEffect(() => {
        if (isRefreshing) {
            fetch(server(url), init)
                .then((res) => res.json())
                .then((d) => {
                    dispatch({
                        type: "SET_DATA",
                        payload: key ? d[key as keyof T] : d,
                    });
                });
        }
    }, [data, defaultState, init, key, isRefreshing, url]);

    return {
        data: data as T,
        handleRefresh,
        isRefreshing,
    };
};

export default useFetch;
