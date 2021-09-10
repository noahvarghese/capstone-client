import {
    Button,
    Form,
    Input,
    Notification,
} from "@noahvarghese/react-components";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router";
import {
    checkEnvironmentBeforeAction,
    setStateFactory,
} from "../../lib/helpers";
import { server } from "../../lib/permalink";
import { emptyValidator } from "../../lib/validators";
import "./ResetPassword.scss";

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

    return (
        <div className="ResetPassword">
            <Form
                url={server + "auth/resetPassword"}
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
                submitFunction={(e: React.SyntheticEvent<Element, Event>) =>
                    new Promise((res, rej) => {
                        e.preventDefault();
                        e.stopPropagation();

                        checkEnvironmentBeforeAction(
                            async () => {
                                const response = await fetch(
                                    server + "auth/resetPassword",
                                    {
                                        method: "POST",
                                        body: JSON.stringify({
                                            ...formState,
                                            token,
                                        }),
                                    }
                                );

                                if (response.status !== 200) {
                                    const { message, field } =
                                        await response.json();
                                    setNotification(message);
                                    setFormErrorState({
                                        ...formErrorState,
                                        [field as keyof typeof formErrorState]:
                                            message as string,
                                    });
                                    rej(message);
                                } else {
                                    setNotification("Password reset");
                                    setSubmitted(true);
                                    res();
                                }
                            },
                            () => {
                                setNotification("Password reset");
                                setSubmitted(true);
                            }
                        );
                    })
                }
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
                        setError: setErrorState("confirm_password"),
                    }}
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: true,
                        validatorFn: (val: string) => {
                            const res = emptyValidator("password")(val);

                            if (res.success) {
                                if (
                                    formState.confirm_password &&
                                    formState.confirm_password !== val
                                ) {
                                    res.success = false;
                                    res.errorMessage = "passwords do not match";
                                }
                            }
                            return res;
                        },
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
                        validatorFn: (val: string) => {
                            let res = emptyValidator("confirm_password")(val);
                            if (res.success) {
                                if (
                                    formState.password &&
                                    formState.password !== val
                                ) {
                                    res.success = false;
                                    res.errorMessage = "passwords do not match";
                                }
                            }
                            return res;
                        },
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
