import React, { useEffect } from "react";
import { Redirect, useHistory } from "react-router";
// import { usePost } from "src/hooks/";
import { server } from "src/util/permalink";
import Loading from "../Loading";

const Logout: React.FC<{
    auth: boolean;
    setAuth: (auth: boolean) => void;
}> = ({ auth, setAuth }) => {
    const history = useHistory();
    // const { submit } = usePost("auth/logout");

    useEffect(() => {
        // submit({})
        fetch(server("auth/logout"), { method: "POST", credentials: "include" })
            .then(() => {
                setAuth(false);
            })
            .catch((e) => {
                console.error(e);
                // history.goBack();
                // alert("Error logging out");
            });
    }, [history, setAuth]);

    if (!auth) {
        return <Redirect to="/" />;
    } else {
        return <Loading />;
    }
};

export default Logout;
