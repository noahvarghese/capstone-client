import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Form,
    Input,
    Select,
} from "@noahvarghese/react-components";
import { connect } from "react-redux";
import { provinces } from "../../data/provinces";
import {
    emptyValidator,
    postalCodeValidator,
    emailValidator,
    phoneValidator,
} from "../../lib/validators";
import { server } from "../../lib/permalink";
import { CustomAction } from "../../types/customAction";
import { checkEnvironmentBeforeAction } from "../../lib/helpers";

const defaultRegisterFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    province: "",
    birthday: "",
    business_code: "",
    password: "",
    confirm_password: "",
    business_name: "",
    business_address: "",
    business_city: "",
    business_postal_code: "",
    business_phone: "",
    business_email: "",
};

const RegisterForm: React.FC<{
    setForm: () => void;
    setAuth: (authenticated: boolean) => CustomAction;
}> = ({ setForm, setAuth }) => {
    const [showNewBusiness, toggleShowNewBusiness] = useState(false);

    const [formState, setFormState] = useState(defaultRegisterFormState);

    const [formErrorState, setFormErrorState] = useState(
        defaultRegisterFormState
    );

    const setState = (name: keyof typeof formState) => (newState: string) =>
        setFormState({ ...formState, [name]: newState });

    const setErrorState =
        (name: keyof typeof formErrorState) => (newState: string) =>
            setFormErrorState({ ...formErrorState, [name]: newState });

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

                    let skipBusinessValues =
                        formState.business_code !== "" &&
                        formState.business_code.trim() !== "";

                    for (let [key, value] of Object.entries(formState)) {
                        if (!skipBusinessValues || !key.includes("business")) {
                            if (value.trim() === "") {
                                empty = true;
                                return;
                            }
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
                    setState: setState("first_name"),
                    value: formState.first_name,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("first_name")(message ?? ""),
                    value: formErrorState.first_name,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: emptyValidator("first_name"),
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
                    value: formState.last_name,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("last_name")(message ?? ""),
                    value: formErrorState.last_name,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: emptyValidator("last_name"),
                }}
                type="text"
                autoComplete="family-name"
                name="last_name"
                placeholder="last name"
                required
            />
            <Input
                state={{
                    setState: setState("address"),
                    value: formState.address,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("address")(message ?? ""),
                    value: formErrorState.address,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: emptyValidator("address"),
                }}
                autoComplete="street-address"
                type="text"
                name="address"
                placeholder="address"
                required
            />
            <Input
                state={{ setState: setState("city"), value: formState.city }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("city")(message ?? ""),
                    value: formErrorState.city,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: emptyValidator("city"),
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
                    value: formState.postal_code,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("postal_code")(message ?? ""),
                    value: formErrorState.postal_code,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: postalCodeValidator,
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
                    value: provinces.find(
                        (val) => val.value === formState.province
                    ) ?? { id: -1, value: "" },
                }}
            />
            <Input
                state={{
                    setState: setState("birthday"),
                    value: formState.birthday,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("birthday")(message ?? ""),
                    value: formErrorState.birthday,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: false,
                    validator: emptyValidator("birthday"),
                }}
                autoComplete="bday"
                type="date"
                name="birthday"
                placeholder="birthday"
                required
            />
            <Input
                state={{ setState: setState("email"), value: formState.email }}
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
                autoComplete="email"
                type="email"
                name="email"
                placeholder="email"
                required
            />
            <Input
                state={{ setState: setState("phone"), value: formState.phone }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("phone")(message ?? ""),
                    value: formErrorState.phone,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: phoneValidator,
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
                    value: formState.password,
                }}
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("password")(message ?? ""),
                    value: formErrorState.password,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: (val: string) => {
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
                type="password"
                autoComplete="new-password"
                name="password"
                placeholder="password"
                required
            />
            <Input
                state={{
                    setState: setState("confirm_password"),
                    value: formState.confirm_password,
                }}
                autoComplete="new-password"
                errorState={{
                    setError: (message?: string) =>
                        setErrorState("confirm_password")(message ?? ""),
                    value: formErrorState.confirm_password,
                }}
                validationOptions={{
                    runOnComplete: true,
                    runOnInput: true,
                    validator: (val: string) => {
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
                type="password"
                name="confirm_password"
                placeholder="confirm password"
                required
            />
            <Checkbox
                name="I am creating a new business account"
                state={{
                    setState: toggleShowNewBusiness,
                    value: showNewBusiness,
                }}
            />
            {showNewBusiness ? (
                <>
                    <Input
                        state={{
                            setState: setState("business_name"),
                            value: formState.business_name,
                        }}
                        errorState={{
                            setError: (message?: string) =>
                                setErrorState("business_name")(message ?? ""),
                            value: formErrorState.business_name,
                        }}
                        validationOptions={{
                            runOnComplete: true,
                            runOnInput: true,
                            validator: emptyValidator("business_name"),
                        }}
                        type="text"
                        name="business_name"
                        placeholder="business name"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_address"),
                            value: formState.business_address,
                        }}
                        errorState={{
                            setError: (message?: string) =>
                                setErrorState("business_address")(
                                    message ?? ""
                                ),
                            value: formErrorState.business_address,
                        }}
                        validationOptions={{
                            runOnComplete: true,
                            runOnInput: true,
                            validator: emptyValidator("business_address"),
                        }}
                        type="text"
                        name="business_address"
                        placeholder="business address"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_address"),
                            value: formState.business_address,
                        }}
                        errorState={{
                            setError: (message?: string) =>
                                setErrorState("business_address")(
                                    message ?? ""
                                ),
                            value: formErrorState.business_address,
                        }}
                        validationOptions={{
                            runOnComplete: true,
                            runOnInput: true,
                            validator: emptyValidator("business_address"),
                        }}
                        type="text"
                        name="business_city"
                        placeholder="business city"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_postal_code"),
                            value: formState.business_postal_code,
                        }}
                        errorState={{
                            setError: (message?: string) =>
                                setErrorState("business_postal_code")(
                                    message ?? ""
                                ),
                            value: formErrorState.business_postal_code,
                        }}
                        validationOptions={{
                            runOnComplete: true,
                            runOnInput: true,
                            validator: postalCodeValidator,
                        }}
                        type="text"
                        name="business_postal_code"
                        placeholder="business postal code"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_phone"),
                            value: formState.business_phone,
                        }}
                        errorState={{
                            setError: (message?: string) =>
                                setErrorState("business_phone")(message ?? ""),
                            value: formErrorState.business_phone,
                        }}
                        validationOptions={{
                            runOnComplete: true,
                            runOnInput: true,
                            validator: phoneValidator,
                        }}
                        type="phone"
                        name="business_phone"
                        placeholder="business phone"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_email"),
                            value: formState.business_email,
                        }}
                        errorState={{
                            setError: (message?: string) =>
                                setErrorState("business_email")(message ?? ""),
                            value: formErrorState.business_email,
                        }}
                        validationOptions={{
                            runOnComplete: true,
                            runOnInput: true,
                            validator: emailValidator,
                        }}
                        type="email"
                        name="business_email"
                        placeholder="business email"
                        required
                    />
                </>
            ) : (
                <Input
                    type="text"
                    name="business_code"
                    placeholder="business code"
                    required
                    state={{
                        setState: setState("business_code"),
                        value: formState.business_code,
                    }}
                    errorState={{
                        setError: (message?: string) =>
                            setErrorState("business_code")(message ?? ""),
                        value: formErrorState.business_code,
                    }}
                    validationOptions={{
                        runOnComplete: true,
                        runOnInput: false,
                        validator: emptyValidator("business_code"),
                    }}
                />
            )}
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
