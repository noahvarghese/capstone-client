import React, { useState } from "react";
import { Button, Form, Input } from "@noahvarghese/react-components";
import { connect } from "react-redux";
import { server } from "../../lib/permalink";
import { CustomAction } from "../../types/customAction";
import {
    checkEnvironmentBeforeAction,
    setStateFactory,
} from "../../lib/helpers";
import { Link } from "react-router-dom";

const defaultLoginFormState = {
    email: "",
    password: "",
};

const LoginForm: React.FC<{
    setForm: () => void;
    setAuth: (auth: boolean) => CustomAction;
}> = ({ setForm, setAuth }) => {
    const [formState, setFormState] = useState(defaultLoginFormState);
    const [formErrorState, setFormErrorState] = useState(defaultLoginFormState);

    const setState = setStateFactory<typeof formState>(setFormState, formState);

    const setErrorState = setStateFactory<typeof formErrorState>(
        setFormErrorState,
        formErrorState
    );

    return (
        <Form
            title="Login"
            method="POST"
            type="card"
            url="/"
            buttons={[
                <Button
                    text="Register"
                    type="button"
                    size="small"
                    onClick={setForm}
                    key="Register"
                />,
                <Button
                    text="Login"
                    key="Login"
                    type="submit"
                    primary
                    size="small"
                />,
            ]}
            submitFunction={(
                e: React.SyntheticEvent<Element, Event>
            ): Promise<void> =>
                new Promise(async (res, rej) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let empty = false;

                    for (let value of Object.values(formErrorState)) {
                        if (value.trim() !== "") {
                            return;
                        }
                    }

                    for (let value of Object.values(formState)) {
                        if (value.trim() === "") {
                            empty = true;
                            return;
                        }
                    }
                    if (!empty) {
                        checkEnvironmentBeforeAction(
                            async () => {
                                const response = await fetch(
                                    server + "auth/login",
                                    {
                                        body: JSON.stringify(formState),
                                    }
                                );
                                const data = await response.json();

                                if (data.success) {
                                    setAuth(true);
                                }
                            },
                            () => setAuth(true)
                        );
                    } else rej();
                })
            }
        >
            <Input
                state={{
                    setState: setState("email"),
                    state: formState.email,
                }}
                errorState={{
                    setError: setErrorState("email"),
                    error: formErrorState.email,
                }}
                type="email"
                name="email"
                placeholder="email"
                required
                autoComplete="email"
                key="email"
            />
            <Input
                state={{
                    setState: setState("password"),
                    state: formState.password,
                }}
                errorState={{
                    setError: setErrorState("password"),
                    error: formErrorState.password,
                }}
                autoComplete="current-password"
                type="password"
                name="password"
                key="password"
                placeholder="password"
                required
            />
            <div className="forgot-password">
                <Link to="/forgotPassword">
                    Click here to reset your password
                </Link>
            </div>
        </Form>
    );
};

export default connect(
    () => ({}),
    (dispatch) => ({
        setAuth: (authenticated: boolean) =>
            dispatch({ type: "SET_AUTHENTICATION", payload: authenticated }),
    })
)(LoginForm);
