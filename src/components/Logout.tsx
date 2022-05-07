import React, { useContext, useEffect } from "react";
import AppContext from "src/context";
import { server } from "src/util/permalink";
import Loading from "src/components/Loading";
import { useHistory } from "react-router-dom";

const Logout: React.FC = () => {
    const history = useHistory();
    const { logout } = useContext(AppContext);

    useEffect(() => {
        fetch(server("/auth/logout"), {
            method: "POST",
            credentials: "include",
            mode: "cors",
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Loading />;
};

export default Logout;
