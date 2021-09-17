import {
    Button,
    Form,
    Input,
    Notification,
} from "@noahvarghese/react-components";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router";
import { setStateFactory } from "../../lib/helpers";
import { server } from "../../lib/permalink";
import { passwordValidator } from "../../lib/validators";
import "./ResetPassword.scss";
import { submitNewPassword } from "../../network-calls/resetPassword";

export const DefaultResetPasswordFormState = {
    password: "",
    confirm_password: "",
};
const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [formState, setFormState] = useState(DefaultResetPasswordFormState);
    const [formErrorState, setFormErrorState] = useState<
        typeof DefaultResetPasswordFormState
    >(DefaultResetPasswordFormState);
    const [submitted, setSubmitted] = useState(false);
    const [notification, setNotification] = useState("");

    const setState = setStateFactory<typeof formState>(setFormState, formState);
    const setErrorState = setStateFactory<typeof formErrorState>(
        setFormErrorState,
        formErrorState
    );

    const hasError = useCallback(() => {
        let error = false;

        for (const val of Object.values(formErrorState)) {
            if (val !== "" || val.trim() !== "") {
                error = true;
                break;
            }
        }

        return error;
    }, [formErrorState]);

    // we know that none of the functions or parameters within will change except for the state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handlePasswordChange = useCallback(
        passwordValidator<typeof formState>(formState),
        [formState]
    );

    const submitForm = useCallback(
        async (e: React.SyntheticEvent<Element, Event>) => {
            e.preventDefault();
            e.stopPropagation();

            try {
                await submitNewPassword(token, formState);
                setNotification("Password reset");
            } catch (e) {
                if (e.field && e.message) {
                    setErrorState(e.field)(e.message);
                } else if (e.message) {
                    setNotification(e.message);
                } else {
                    setNotification("An unexpected error occurred");
                }
            }
        },
        [formState, setErrorState, token]
    );

    return (
        <div className="ResetPassword">
            <Form
                url={server("auth/resetPassword")}
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
                title="Reset Password"
                type="card"
                method="POST"
                submitFunction={submitForm}
            >
                <Input
                    type="password"
                    name="password"
                    placeholder="password"
                    autoComplete="new-password"
                    required
                    state={{
                        state: formState.password,
                        setState: setState("password"),
                    }}
                    errorState={{
                        error: formErrorState.password,
                        setError: setErrorState("password"),
                    }}
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: true,
                        validatorFn: handlePasswordChange("password"),
                    }}
                />
                <Input
                    type="password"
                    name="confirm_password"
                    autoComplete="new-password"
                    required
                    state={{
                        state: formState.confirm_password,
                        setState: setState("confirm_password"),
                    }}
                    errorState={{
                        error: formErrorState.confirm_password,
                        setError: setErrorState("confirm_password"),
                    }}
                    placeholder="confirm password"
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: true,
                        validatorFn: handlePasswordChange("confirm_password"),
                    }}
                />
                <Notification
                    message={notification}
                    error={hasError()}
                    hide={() => setSubmitted(false)}
                    display={submitted}
                />
            </Form>
        </div>
    );
};

export default ResetPassword;
