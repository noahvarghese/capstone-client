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
import { emptyValidator } from "../../lib/validators";
import { server } from "../../lib/permalink";
import { CustomAction } from "../../types/customAction";
import {
    checkEnvironmentBeforeAction,
    setStateFactory,
} from "../../lib/helpers";

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

    const setState = setStateFactory<typeof defaultRegisterFormState>(
        setFormState,
        formState
    );
    const setErrorState = setStateFactory<typeof defaultRegisterFormState>(
        setFormErrorState,
        formErrorState
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
                state={{ setState: setState("city"), state: formState.city }}
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
            <Input
                state={{
                    setState: setState("birthday"),
                    state: formState.birthday,
                }}
                errorState={{
                    setError: setErrorState("birthday"),
                    error: formErrorState.birthday,
                }}
                autoComplete="bday"
                type="date"
                name="birthday"
                placeholder="birthday"
                required
            />
            <Input
                state={{ setState: setState("email"), state: formState.email }}
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
                state={{ setState: setState("phone"), state: formState.phone }}
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
                type="password"
                name="confirm_password"
                placeholder="confirm password"
                required
            />
            <Checkbox
                name="I am creating a new business account"
                state={{
                    setState: toggleShowNewBusiness,
                    state: showNewBusiness,
                }}
            />
            {showNewBusiness ? (
                <>
                    <Input
                        state={{
                            setState: setState("business_name"),
                            state: formState.business_name,
                        }}
                        errorState={{
                            setError: setErrorState("business_name"),
                            error: formErrorState.business_name,
                        }}
                        type="text"
                        name="business_name"
                        placeholder="business name"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_address"),
                            state: formState.business_address,
                        }}
                        errorState={{
                            setError: setErrorState("business_address"),
                            error: formErrorState.business_address,
                        }}
                        type="text"
                        name="business_address"
                        placeholder="business address"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_address"),
                            state: formState.business_address,
                        }}
                        errorState={{
                            setError: setErrorState("business_address"),
                            error: formErrorState.business_address,
                        }}
                        type="text"
                        name="business_city"
                        placeholder="business city"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_postal_code"),
                            state: formState.business_postal_code,
                        }}
                        errorState={{
                            setError: setErrorState("business_postal_code"),
                            error: formErrorState.business_postal_code,
                        }}
                        type="text"
                        name="business_postal_code"
                        placeholder="business postal code"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_phone"),
                            state: formState.business_phone,
                        }}
                        errorState={{
                            setError: setErrorState("business_phone"),
                            error: formErrorState.business_phone,
                        }}
                        type="tel"
                        name="business_phone"
                        placeholder="business phone"
                        required
                    />
                    <Input
                        state={{
                            setState: setState("business_email"),
                            state: formState.business_email,
                        }}
                        errorState={{
                            setError: setErrorState("business_email"),
                            error: formErrorState.business_email,
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
                        state: formState.business_code,
                    }}
                    errorState={{
                        setError: setErrorState("business_code"),
                        error: formErrorState.business_code,
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
