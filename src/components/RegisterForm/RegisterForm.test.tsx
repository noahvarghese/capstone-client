import React from "react";
import RegisterForm from ".";
import App from "../../App";
import { store } from "../../store";
import { fireEmptyChangeEvent, submitForm } from "../../test/helpers";
import { render, screen, fireEvent, cleanup } from "../../test/test-utils";
import DefaultState from "../../types/state";
import RegisterAttributes from "../../test/attributes/RegisterForm";
import { createMemoryHistory } from "history";

describe("General form behaviour", () => {
    beforeEach(() => {
        render(
            <RegisterForm
                setForm={() => {
                    return;
                }}
            />
        );
    });

    test("when confirm password is empty should show error message", () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        ) as HTMLInputElement;

        fireEmptyChangeEvent(
            confirmPasswordEl,
            RegisterAttributes.validInputs.password
        );

        const errorEl = screen.getByText(
            RegisterAttributes.errors.empty_confirm_password
        );

        expect(errorEl).toBeInTheDocument();
    });

    test("password is empty should show error", () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        ) as HTMLInputElement;

        fireEmptyChangeEvent(
            passwordEl,
            RegisterAttributes.invalidInputs.password
        );

        const errorEl = screen.getByText(
            RegisterAttributes.errors.empty_password
        );

        expect(errorEl).toBeInTheDocument();
    });

    test("confirm password does not match password should show error", () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );
        fireEvent.change(passwordEl, {
            target: { value: RegisterAttributes.invalidInputs.password },
        });

        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );
        fireEvent.change(confirmPasswordEl, {
            target: {
                value: RegisterAttributes.invalidInputs.confirm_password,
            },
        });

        const confirmPasswordErrorEl =
            confirmPasswordEl.parentElement?.getElementsByClassName(
                "error-message"
            );

        expect(confirmPasswordErrorEl?.length).toBe(1);
        expect(
            confirmPasswordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(RegisterAttributes.errors.no_match);
    });

    test("password does not match confirm password should show error", () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );
        fireEvent.change(confirmPasswordEl, {
            target: {
                value: RegisterAttributes.invalidInputs.confirm_password,
            },
        });

        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );
        fireEvent.change(passwordEl, {
            target: { value: RegisterAttributes.invalidInputs.password },
        });

        const passwordErrorEl =
            passwordEl.parentElement?.getElementsByClassName("error-message");

        expect(passwordErrorEl?.length).toBe(1);
        expect(
            passwordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(RegisterAttributes.errors.no_match);
    });

    test("confirm password does not match password when corrected should show no error", () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );

        fireEvent.change(passwordEl, {
            target: { value: RegisterAttributes.validInputs.password },
        });

        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );
        fireEvent.change(confirmPasswordEl, {
            target: {
                value: RegisterAttributes.invalidInputs.confirm_password,
            },
        });

        // Check errors
        let confirmPasswordErrorEl =
            confirmPasswordEl.parentElement?.getElementsByClassName(
                "error-message"
            );

        expect(confirmPasswordErrorEl?.length).toBe(1);
        expect(
            confirmPasswordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(RegisterAttributes.errors.no_match);

        fireEvent.change(confirmPasswordEl, {
            target: { value: RegisterAttributes.validInputs.confirm_password },
        });

        confirmPasswordErrorEl =
            confirmPasswordEl.parentElement?.getElementsByClassName(
                "error-message"
            );

        expect(confirmPasswordErrorEl).toBeUndefined();
    });

    test("when the password does not match confirm password and is corrected should show no error", () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );
        fireEvent.change(confirmPasswordEl, {
            target: {
                value: RegisterAttributes.validInputs.confirm_password,
            },
        });

        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );
        fireEvent.change(passwordEl, {
            target: { value: RegisterAttributes.invalidInputs.password },
        });

        // Check errors
        let passwordErrorEl =
            passwordEl.parentElement?.getElementsByClassName("error-message");

        expect(passwordErrorEl?.length).toBe(1);
        expect(
            passwordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(RegisterAttributes.errors.no_match);

        fireEvent.change(passwordEl, {
            target: { value: RegisterAttributes.validInputs.password },
        });

        passwordErrorEl =
            passwordEl.parentElement?.getElementsByClassName("error-message");

        expect(passwordErrorEl).toBeUndefined();
    });
});

test("Succesful register should redirect to Dashboard", () => {
    const history = createMemoryHistory();
    const unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;
    submitForm(/register/i, RegisterAttributes.validInputs, /logout/i);

    unmount();
    cleanup();
});
