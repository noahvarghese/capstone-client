import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { fetchWithCredentials } from "../../lib/fetchHelper";
import { server } from "../../lib/permalink";
import { CustomAction } from "../../types/customAction";
import { State } from "../../types/state";

const Logout: React.FC<{
    auth: boolean;
    setAuth: (auth: boolean) => CustomAction;
}> = ({ auth, setAuth }) => {
    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                await fetchWithCredentials(server("auth/logout"), {
                    method: "POST",
                });
                history.push("/");
                setAuth(false);
            } catch (_) {
                history.goBack();
                alert("Error logging out");
            }
        })();
    });

    if (!auth) {
        return <Redirect to="/" />;
    } else {
        return <div></div>;
    }
};

export default connect(
    (state: State) => ({ auth: state.auth.authentication }),
    (dispatch) => ({
        setAuth: (authenticated: boolean) =>
            dispatch({ type: "SET_AUTHENTICATION", payload: authenticated }),
    })
)(Logout);
