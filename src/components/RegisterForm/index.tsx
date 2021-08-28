import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Form,
    Input,
    RadioFieldset,
} from "@noahvarghese/react-components";
import { connect } from "react-redux";

const RegisterForm: React.FC<{ setForm: () => void }> = ({ setForm }) => {
    const [showNewBusiness, toggleShowNewBusiness] = useState(false);

    const [formState, setFormState] = useState({
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
        employee_type: "",
    });

    const [formErrorState, setFormErrorState] = useState({
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
        employee_type: "",
    });

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
                    type="reset"
                    size="small"
                    onClick={setForm}
                />,
                <Button text="Register" type="submit" primary size="small" />,
            ]}
            submitFunction={(
                e: React.SyntheticEvent<Element, Event>
            ): Promise<void> => new Promise((res, rej) => res())}
        >
            <Input
                state={{
                    setState: setState("first_name"),
                    value: formState.first_name,
                }}
                type="text"
                name="first name"
                placeholder="first name"
                required
            />
            <Input
                state={{
                    setState: setState("last_name"),
                    value: formState.last_name,
                }}
                type="text"
                name="last name"
                placeholder="last name"
                required
            />
            <Input
                state={{
                    setState: setState("address"),
                    value: formState.address,
                }}
                type="text"
                name="address"
                placeholder="address"
                required
            />
            <Input
                state={{ setState: setState("city"), value: formState.city }}
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
                type="text"
                name="postal code"
                placeholder="postal code"
                required
            />
            <Input
                state={{
                    setState: setState("province"),
                    value: formState.province,
                }}
                type="text"
                name="province"
                placeholder="province"
                required
            />
            <Input
                state={{
                    setState: setState("birthday"),
                    value: formState.birthday,
                }}
                type="date"
                name="birthday"
                placeholder="birthday"
                required
            />
            <Input
                state={{ setState: setState("email"), value: formState.email }}
                type="email"
                name="email"
                placeholder="email"
                required
            />
            <Input
                state={{
                    setState: setState("password"),
                    value: formState.password,
                }}
                type="password"
                name="password"
                placeholder="password"
                required
            />
            <Input
                state={{
                    setState: setState("confirm_password"),
                    value: formState.confirm_password,
                }}
                type="password"
                name="confirm password"
                placeholder="confirm password"
                required
            />
            <RadioFieldset
                title="I am a(n)"
                radioProps={[
                    {
                        name: "employee_type",
                        id: "employee",
                        label: "employee",
                        state: {
                            setState: () =>
                                setState("employee_type")("employee"),
                            value: formState.employee_type === "employee",
                        },
                    },
                    {
                        name: "employee_type",
                        id: "manager",
                        label: "manager",
                        state: {
                            setState: () =>
                                setState("employee_type")("manager"),
                            value: formState.employee_type === "manager",
                        },
                    },
                ]}
            />
            <Checkbox
                name="I am creating a new business account"
                state={{
                    setState: toggleShowNewBusiness,
                    value: showNewBusiness,
                }}
            />
            {!showNewBusiness && (
                <Input
                    type="text"
                    name="business code"
                    placeholder="business code"
                    required
                    state={{
                        setState: setState("business_code"),
                        value: formState.business_code,
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
            dispatch({ type: "SET_AUTHENTICATED", payload: authenticated }),
    })
)(RegisterForm);
