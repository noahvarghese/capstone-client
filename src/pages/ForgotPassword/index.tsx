import {
    Button,
    Form,
    Input,
    Notification,
} from "@noahvarghese/react-components";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    checkEnvironmentBeforeAction,
    setStateFactory,
} from "../../lib/helpers";
import { server } from "../../lib/permalink";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
    const [formState, setFormState] = useState({ email: "" });
    const [formErrorState, setFormErrorState] = useState({ email: "" });
    const [submitted, setSubmitted] = useState(false);
    const [notification, setNotification] = useState("");

    const setState = setStateFactory<{ email: string }>(
        setFormState,
        formState
    );

    const setErrorState = setStateFactory<{ email: string }>(
        setFormErrorState,
        formErrorState
    );

    return (
        <div className="ForgotPassword">
            <Form
                buttons={[
                    <Button
                        key="Submit"
                        text="Submit"
                        primary
                        size="small"
                        type="submit"
                        disabled={submitted}
                    />,
                ]}
                title="Forgot Password"
                type="card"
                method="POST"
                submitFunction={(e: React.SyntheticEvent<Element, Event>) =>
                    new Promise((res, rej) => {
                        e.preventDefault();
                        e.stopPropagation();

                        checkEnvironmentBeforeAction(
                            async () => {
                                let preventSubmit = false;

                                for (const val of Object.values(formState)) {
                                    if (val === "" || val.trim() === "") {
                                        preventSubmit = true;
                                        break;
                                    }
                                }
                                if (!preventSubmit) {
                                    for (const val of Object.values(
                                        formErrorState
                                    )) {
                                        if (val !== "" || val.trim() !== "") {
                                            preventSubmit = true;
                                            break;
                                        }
                                    }
                                }

                                if (!preventSubmit) {
                                    const response = await fetch(
                                        server + "auth/requestResetPassword",
                                        {
                                            method: "POST",
                                            body: JSON.stringify(formState),
                                        }
                                    );

                                    if (response.status !== 200) {
                                        const { message } =
                                            await response.json();
                                        setNotification(message);
                                        setFormErrorState({ email: message });
                                        rej(message);
                                    } else {
                                        setNotification("Email sent");
                                        setSubmitted(true);
                                    }
                                    res();
                                }
                            },
                            () => {
                                let preventSubmit = false;

                                for (const val of Object.values(formState)) {
                                    if (val === "" || val.trim() === "") {
                                        preventSubmit = true;
                                        break;
                                    }
                                }
                                if (!preventSubmit) {
                                    for (const val of Object.values(
                                        formErrorState
                                    )) {
                                        if (val !== "" || val.trim() !== "") {
                                            preventSubmit = true;
                                            break;
                                        }
                                    }
                                }
                                if (!preventSubmit) {
                                    setNotification("Email sent");
                                    setSubmitted(true);
                                }
                                res();
                            }
                        );
                    })
                }
                url={server + "/auth/requestResetPassword"}
            >
                <Input
                    type="email"
                    readonly={submitted}
                    required
                    name="email"
                    autoComplete="email"
                    placeholder="email"
                    state={{
                        setState: setState("email"),
                        state: formState.email,
                    }}
                    errorState={{
                        setError: setErrorState("email"),
                        error: formErrorState.email,
                    }}
                />
                <div className="back-to-login">
                    <Link to="/">Go back to login</Link>
                </div>
                <Notification
                    error={formErrorState.email !== ""}
                    message={notification}
                    display={submitted}
                    hide={() => setSubmitted(false)}
                />
            </Form>
        </div>
    );
};

export default ForgotPassword;
