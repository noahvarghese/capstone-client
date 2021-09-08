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

    test("confirm_password is empty should show error message", () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirmPassword
        );

        fireEmptyChangeEvent(confirmPasswordEl, { target: { value: "yolo" } });

        const errorEl = screen.getByText(
            RegisterAttributes.errors.emptyConfirmPassword
        );

        expect(errorEl).toBeInTheDocument();
    });

    test("password is empty should show error", () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );

        fireEmptyChangeEvent(passwordEl, { target: { value: "yolo" } });

        const errorEl = screen.getByText(
            RegisterAttributes.errors.emptyPassword
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
            RegisterAttributes.formLabels.confirmPassword
        );
        fireEvent.change(confirmPasswordEl, {
            target: { value: RegisterAttributes.invalidInputs.confirmPassword },
        });

        const confirmPasswordErrorEl =
            confirmPasswordEl.parentElement?.getElementsByClassName(
                "error-message"
            );

        expect(confirmPasswordErrorEl?.length).toBe(1);
        expect(
            confirmPasswordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(RegisterAttributes.errors.noMatch);
    });

    test("password does not match confirm password should show error", () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirmPassword
        );
        fireEvent.change(confirmPasswordEl, {
            target: { value: RegisterAttributes.invalidInputs.confirmPassword },
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
        ).toBe(RegisterAttributes.errors.noMatch);
    });

    test("confirm password does not match password when corrected should show no error", () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );
        fireEvent.change(passwordEl, {
            target: { value: RegisterAttributes.invalidInputs.password },
        });

        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirmPassword
        );
        fireEvent.change(confirmPasswordEl, {
            target: { value: RegisterAttributes.invalidInputs.confirmPassword },
        });
    });

    test("when the password does not match confirm password and is corrected should show no error", () => {});
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
