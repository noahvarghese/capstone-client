import React, { useState } from "react";
import { Button, Form, Input } from "@noahvarghese/react-components";
import { connect } from "react-redux";
import { emailValidator, emptyValidator } from "../../lib/validators";

const defaultLoginFormState = {
    email: "",
    password: "",
};

const LoginForm: React.FC<{ setForm: () => void }> = ({ setForm }) => {
    const [formState, setFormState] = useState(defaultLoginFormState);
    const [formErrorState, setFormErrorState] = useState(defaultLoginFormState);

    const setState = (name: keyof typeof formState) => (newState: string) =>
        setFormState({ ...formState, [name]: newState });

    const setErrorState =
        (name: keyof typeof formErrorState) => (newState: string) =>
            setFormErrorState({ ...formErrorState, [name]: newState });

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
            ): Promise<void> => new Promise((res, rej) => res())}
        >
            <Input
                state={{
                    setState: setState("email"),
                    value: formState.email,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("email")(message ?? ""),
                    value: formErrorState.email,
                }}
                validationOptions={{
                    runOnInput: true,
                    runOnComplete: true,
                    validator: emailValidator,
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
                    value: formState.password,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("password")(message ?? ""),
                    value: formErrorState.password,
                }}
                validationOptions={{
                    runOnInput: true,
                    runOnComplete: true,
                    validator: emptyValidator("password"),
                }}
                autoComplete="current-password"
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
