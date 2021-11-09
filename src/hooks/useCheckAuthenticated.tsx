import { useEffect, useReducer } from "react";
import { server } from "src/util/permalink";

interface State {
    auth: boolean;
    loading: boolean;
}

const reducer = (
    state: State,
    action: "IS_AUTH" | "NO_AUTH" | "LOADING"
): State => {
    switch (action) {
        case "IS_AUTH":
            return { auth: true, loading: false };
        case "NO_AUTH":
            return { auth: false, loading: false };
        case "LOADING":
            return { auth: state.auth, loading: true };
        default:
            throw new Error();
    }
};

const useCheckAuth = () => {
    const [state, dispatch] = useReducer(reducer, {
        auth: false,
        loading: true,
    });

    useEffect(() => {
        fetch(server("auth"), {
            credentials: "include",
            method: "POST",
        })
            .then((response) => {
                if (response.ok) dispatch("IS_AUTH");
                else dispatch("NO_AUTH");
            })
            .catch((_) => {
                dispatch("NO_AUTH");
            });
    }, []);

    return {
        authenticated: state.auth,
        loading: state.loading,
        setAuthenticated: (auth: boolean) => {
            dispatch(auth ? "IS_AUTH" : "NO_AUTH");
        },
    };
};

export default useCheckAuth;
