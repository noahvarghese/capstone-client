import React, { useContext, useEffect } from "react";
import AppContext from "src/context";
import { server } from "src/util/permalink";
import Loading from "src/components/Loading";
import { useHistory } from "react-router-dom";

const Logout: React.FC = () => {
    const history = useHistory();
    const { logout } = useContext(AppContext);

    useEffect(() => {
        const controller = new AbortController();

        fetch(server("/auth/logout"), {
            method: "POST",
            credentials: "include",
            mode: "cors",
            signal: controller.signal,
        })
            .then((res) => {
                if (res.ok) {
                    logout();
                    history.push("/");
                    window.location.href = "/";
                }
            })
            .catch((e) => {
                const { message } = e as Error;
                console.error(message);
                alert("Error logging out");
            });

        return () => controller.abort();
        // navigate causes problems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logout]);

    return <Loading />;
};

export default Logout;
