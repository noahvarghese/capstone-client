import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import { checkAuthenticated } from "../../network-calls/checkAuthenticated";
import { CustomAction } from "../../types/customAction";
import "./Login.scss";

const Login: React.FC<{ setAuth: (authenticated: boolean) => CustomAction }> =
    ({ setAuth }) => {
        const [displayForm, setDisplayForm] = useState<0 | 1>(0);

        useEffect(() => {
            (async () => {
                try {
                    await checkAuthenticated();
                    setAuth(true);
                } catch (_) {
                    console.log(_);
                    return;
                }
            })();
        }, [setAuth]);

        return (
            <div className="Login">
                <h1>Welcome OnBoard</h1>
                {displayForm === 0 ? (
                    <LoginForm setForm={() => setDisplayForm(1)} />
                ) : (
                    <RegisterForm setForm={() => setDisplayForm(0)} />
                )}
            </div>
        );
    };

export default connect(
    () => ({}),
    (dispatch) => ({
        setAuth: (authenticated: boolean) =>
            dispatch({ type: "SET_AUTHENTICATION", payload: authenticated }),
    })
)(Login);
