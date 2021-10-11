import React, { useCallback, useState } from "react";
import {
    Button,
    Form,
    Input,
    Select,
    Notification,
} from "@noahvarghese/react-components";
import { connect } from "react-redux";
import { provinces } from "../../data/provinces";
import { passwordValidator } from "../../lib/validators";
import { CustomAction } from "../../types/customAction";
import { setStateFactory } from "../../lib/helpers";
import register from "../../network-calls/register";

const defaultRegisterFormState = {
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    province: "",
    password: "",
    confirm_password: "",
};

type RegisterFormAttributes = typeof defaultRegisterFormState;

const RegisterForm: React.FC<{
    setForm: () => void;
    setAuth: (authenticated: boolean) => CustomAction;
}> = ({ setForm, setAuth }) => {
    const [notificationError, setNotificationError] = useState("");
    const [formState, setFormState] = useState(defaultRegisterFormState);

    const [formErrorState, setFormErrorState] = useState(
        defaultRegisterFormState
    );

    const setState = setStateFactory<RegisterFormAttributes>(
        setFormState,
        formState
    );
    const setErrorState = setStateFactory<RegisterFormAttributes>(
        setFormErrorState,
        formErrorState
    );

    const submitForm = useCallback(
        async (e: React.SyntheticEvent<Element, Event>): Promise<void> => {
            e.preventDefault();
            e.stopPropagation();

            let empty = false;

            for (let value of Object.values(formErrorState)) {
                if (value.trim() !== "") {
                    return;
                }
            }

            for (let [key, value] of Object.entries(formState)) {
                if (value.trim() === "") {
                    setErrorState(key as keyof RegisterFormAttributes)(
                        `${key.split("_").join(" ")} cannot be empty`
                    );
                    empty = true;
                    return;
                }
            }

            if (!empty) {
                try {
                    await register(formState);
                    setAuth(true);
                } catch (e) {
                    if (e.field && e.message) {
                        setErrorState(e.field)(e.message);
                    } else if (e.message) {
                        setNotificationError(e.message);
                    }
                }
            }
        },
        [formErrorState, formState, setAuth, setErrorState]
    );

    // we know that none of the functions or parameters within will change except for the state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handlePasswordChange = useCallback(
        passwordValidator<typeof formState>(formState),
        [formState]
    );

    return (
        <Form
            title="Register"
            method="POST"
            type="card"
            url="/"
            buttons={[
                <Button
                    text="Login"
                    key="Login"
                    type="reset"
                    size="small"
                    onClick={() => {
                        setForm();
                    }}
                />,
                <Button
                    text="Register"
                    key="Register"
                    type="submit"
                    primary
                    size="small"
                />,
            ]}
            submitFunction={submitForm}
        >
            <fieldset>
                <legend>User</legend>
                <Input
                    state={{
                        setState: setState("first_name"),
                        state: formState.first_name,
                    }}
                    errorState={{
                        setError: setErrorState("first_name"),
                        error: formErrorState.first_name,
                    }}
                    autoComplete="given-name"
                    type="text"
                    name="first_name"
                    placeholder="first name"
                    required
                />
                <Input
                    state={{
                        setState: setState("last_name"),
                        state: formState.last_name,
                    }}
                    errorState={{
                        setError: setErrorState("last_name"),
                        error: formErrorState.last_name,
                    }}
                    type="text"
                    autoComplete="family-name"
                    name="last_name"
                    placeholder="last name"
                    required
                />
                <Input
                    state={{
                        setState: setState("email"),
                        state: formState.email,
                    }}
                    errorState={{
                        setError: setErrorState("email"),
                        error: formErrorState.email,
                    }}
                    autoComplete="email"
                    type="email"
                    name="email"
                    placeholder="email"
                    required
                />
                <Input
                    state={{
                        setState: setState("phone"),
                        state: formState.phone,
                    }}
                    errorState={{
                        setError: setErrorState("phone"),
                        error: formErrorState.phone,
                    }}
                    autoComplete="tel"
                    type="tel"
                    name="phone"
                    placeholder="phone"
                    required
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
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: true,
                        validatorFn: handlePasswordChange("password"),
                    }}
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    placeholder="password"
                    required
                />
                <Input
                    state={{
                        setState: setState("confirm_password"),
                        state: formState.confirm_password,
                    }}
                    autoComplete="new-password"
                    errorState={{
                        setError: setErrorState("confirm_password"),
                        error: formErrorState.confirm_password,
                    }}
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: true,
                        validatorFn: handlePasswordChange("confirm_password"),
                    }}
                    type="password"
                    name="confirm_password"
                    placeholder="confirm password"
                    required
                />
            </fieldset>
            <fieldset>
                <legend>Business</legend>
                <Input
                    state={{
                        setState: setState("name"),
                        state: formState.name,
                    }}
                    errorState={{
                        setError: setErrorState("name"),
                        error: formErrorState.name,
                    }}
                    type="text"
                    name="name"
                    placeholder="name"
                    required
                />
                <Input
                    state={{
                        setState: setState("address"),
                        state: formState.address,
                    }}
                    errorState={{
                        setError: setErrorState("address"),
                        error: formErrorState.address,
                    }}
                    autoComplete="street-address"
                    type="text"
                    name="address"
                    placeholder="address"
                    required
                />
                <Input
                    state={{
                        setState: setState("city"),
                        state: formState.city,
                    }}
                    errorState={{
                        setError: setErrorState("city"),
                        error: formErrorState.city,
                    }}
                    autoComplete="address-level2"
                    type="text"
                    name="city"
                    placeholder="city"
                    required
                />
                <Input
                    state={{
                        setState: setState("postal_code"),
                        state: formState.postal_code,
                    }}
                    errorState={{
                        setError: setErrorState("postal_code"),
                        error: formErrorState.postal_code,
                    }}
                    type="text"
                    name="postal_code"
                    placeholder="postal code"
                    autoComplete="postal-code"
                    required
                />
                <Select
                    items={provinces}
                    name="province"
                    placeholder="province"
                    required
                    state={{
                        setState: (val) => setState("province")(val.value),
                        state: provinces.find(
                            (val) => val.value === formState.province
                        ) ?? { id: -1, value: "" },
                    }}
                />
            </fieldset>

            <Notification
                error={
                    notificationError !== "" && notificationError.trim() !== ""
                }
                message={notificationError}
                hide={() => setNotificationError("")}
                display={
                    notificationError !== "" && notificationError.trim() !== ""
                }
            />
        </Form>
    );
};

export default connect(
    () => ({}),
    (dispatch) => ({
        setAuth: (authenticated: boolean) =>
            dispatch({ type: "SET_AUTHENTICATION", payload: authenticated }),
    })
)(RegisterForm);
