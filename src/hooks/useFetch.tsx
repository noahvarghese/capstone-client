import { useCallback, useEffect, useReducer } from "react";
import Emitter from "src/services/emitter";
import { server } from "src/util/permalink";

interface FetchHookResult<T> {
    data: T;
    handleRefresh: () => void;
    isRefreshing: boolean;
    failed: boolean;
}

interface State<T> {
    isRefreshing: boolean;
    failed: boolean;
    data: T;
}
const reducer =
    <T,>(defaultData: T) =>
    (
        state: State<T>,
        action: { payload?: T; type: "SET_DATA" | "REFRESH" | "FAILED" }
    ): State<T> => {
        switch (action.type) {
            case "SET_DATA":
                return {
                    data: action.payload ?? defaultData,
                    isRefreshing: false,
                    failed: false,
                };
            case "REFRESH":
                return { data: state.data, isRefreshing: true, failed: false };
            case "FAILED":
                console.log("HERE");
                return {
                    data: defaultData,
                    isRefreshing: false,
                    failed: true,
                };
            default:
                throw new Error("Invalid action");
        }
    };

/**
 * Emits an event of RESPONSE_RECEIVED when the request completes or fails
 * @param url
 * @param defaultState
 * @param init
 * @param key
 * @returns
 */
const useFetch = <T,>(
    url: string,
    defaultData: T,
    init?: RequestInit | undefined,
    key?: string
): FetchHookResult<T> => {
    const [{ data, isRefreshing, failed }, dispatch] = useReducer(
        reducer(defaultData),
        {
            data: defaultData,
            isRefreshing: true,
            failed: false,
        }
    );

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
                })
                .catch(() => {
                    dispatch({
                        type: "FAILED",
                    });
                })
                .finally(() => Emitter.emit("RESPONSE_RECEIVED"));
        }
    }, [data, defaultData, init, key, isRefreshing, url]);

    return {
        data: data as T,
        handleRefresh,
        isRefreshing,
        failed,
    };
};

export default useFetch;
