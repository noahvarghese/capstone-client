import React, { useState } from "react";
import { Button, Form, Input } from "@noahvarghese/react-components";
import { connect } from "react-redux";

const LoginForm: React.FC<{ setForm: () => void }> = ({ setForm }) => {
    const [formState, setFormState] = useState({ email: "", password: "" });
    const setState = (name: string) => (newState: string) =>
        setFormState({ ...formState, [name]: newState });

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
                />,
                <Button text="Login" type="submit" primary size="small" />,
            ]}
            submitFunction={(
                e: React.SyntheticEvent<Element, Event>
            ): Promise<void> => new Promise((res, rej) => res())}
        >
            <Input
                state={{
                    setState: setState("email"),
                    value: formState.email,
                }}
                type="email"
                name="email"
                placeholder="email"
                required
                key="email"
            />
            <Input
                state={{
                    setState: setState("password"),
                    value: formState.password,
                }}
                type="password"
                name="password"
                key="password"
                placeholder="password"
                required
            />
        </Form>
    );
};

export default connect(
    () => ({}),
    (dispatch) => ({
        setAuth: (authenticated: boolean) =>
            dispatch({ type: "SET_AUTHENTICATED", payload: authenticated }),
    })
)(LoginForm);
