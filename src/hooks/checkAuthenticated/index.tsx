import { useEffect, useState } from "react";
import { server } from "src/lib/permalink";

const useCheckAuth = () => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(server("auth"), {
            credentials: "include",
            method: "POST",
        })
            .then((response) => {
                if (response.ok) setAuth(true);
            })
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    return { authenticated: auth, loading, setAuthenticated: setAuth };
};

export default useCheckAuth;
