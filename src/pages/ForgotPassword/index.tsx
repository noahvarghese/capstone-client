import { Button, Form, Input } from "@noahvarghese/react-components";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { checkEnvironmentBeforeAction, setState } from "../../lib/helpers";
import { server } from "../../lib/permalink";
import { emailValidator } from "../../lib/validators";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
    const [formState, setFormState] = useState({ email: "" });
    const [formErrorState, setFormErrorState] = useState({ email: "" });

    return (
        <div className="ForgotPassword">
            <Form
                buttons={[
                    <Button text="Submit" primary size="small" type="submit" />,
                ]}
                title="Forgot Password"
                type="card"
                method="POST"
                submitFunction={(e: React.SyntheticEvent<Element, Event>) =>
                    new Promise((res, rej) => {
                        checkEnvironmentBeforeAction(
                            true,
                            () => {},
                            () => {}
                        );
                    })
                }
                url={server + "/auth/forgot-password"}
            >
                <Input
                    type="email"
                    required
                    name="email"
                    autoComplete="email"
                    placeholder="email"
                    state={{
                        setState: setState<typeof formState>(
                            setFormState,
                            formState
                        )("email"),
                        value: formState.email,
                    }}
                    errorState={{
                        setError: setState<typeof formErrorState>(
                            setFormErrorState,
                            formErrorState
                        )("email"),
                        value: formErrorState.email,
                    }}
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: true,
                        validator: emailValidator,
                    }}
                />
                <div className="back-to-login">
                    <Link to="/">Go back to login</Link>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPassword;
