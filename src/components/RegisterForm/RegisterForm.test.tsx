import React from "react";
import RegisterForm from ".";
import App from "../../App";
import { store } from "../../store";
import { submitForm } from "../../test/helpers";
import { render, screen, cleanup, waitFor } from "../../test/test-utils";
import DefaultState from "../../types/state";
import RegisterAttributes from "../../test/attributes/RegisterForm";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";

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

    test("when confirm password is empty should show error message", async () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        ) as HTMLInputElement;

        userEvent.type(
            confirmPasswordEl,
            RegisterAttributes.validInputs.confirm_password
        );
        userEvent.clear(confirmPasswordEl);

        await waitFor(() => {
            const confirmPasswordErrorEl =
                confirmPasswordEl.parentElement?.getElementsByClassName(
                    "error-message"
                );

            expect(confirmPasswordErrorEl?.length).toBe(1);
            expect(
                confirmPasswordErrorEl![0].getElementsByTagName("p")[0]
                    .textContent
            ).toBe(RegisterAttributes.errors.empty_confirm_password);
        });
    });

    test("when password is empty should show error", async () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        ) as HTMLInputElement;

        userEvent.type(passwordEl, RegisterAttributes.validInputs.password);
        userEvent.clear(passwordEl);

        await waitFor(() => {
            const passwordErrorEl =
                passwordEl.parentElement?.getElementsByClassName(
                    "error-message"
                );

            expect(passwordErrorEl?.length).toBe(1);
            expect(
                passwordErrorEl![0].getElementsByTagName("p")[0].textContent
            ).toBe(RegisterAttributes.errors.empty_password);
        });
    });

    test("confirm password does not match password should show error", () => {
        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );

        userEvent.type(passwordEl, RegisterAttributes.validInputs.password);

        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );

        userEvent.type(
            confirmPasswordEl,
            RegisterAttributes.invalidInputs.confirm_password
        );

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

        userEvent.type(
            confirmPasswordEl,
            RegisterAttributes.validInputs.confirm_password
        );

        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );

        userEvent.type(passwordEl, RegisterAttributes.invalidInputs.password);

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

        userEvent.type(passwordEl, RegisterAttributes.validInputs.password);

        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );

        userEvent.type(
            confirmPasswordEl,
            RegisterAttributes.invalidInputs.confirm_password
        );

        expect(confirmPasswordEl.parentElement?.classList).toContain("error");

        userEvent.clear(confirmPasswordEl);
        userEvent.type(
            confirmPasswordEl,
            RegisterAttributes.validInputs.confirm_password
        );

        expect(confirmPasswordEl.parentElement?.classList).not.toContain(
            "error"
        );

        let confirmPasswordErrorEl =
            confirmPasswordEl.parentElement?.getElementsByClassName(
                "error-message"
            );

        expect(confirmPasswordErrorEl?.length).toBe(0);
    });

    test("when the password does not match confirm password and is corrected should show no error", () => {
        const confirmPasswordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.confirm_password
        );

        userEvent.type(
            confirmPasswordEl,
            RegisterAttributes.validInputs.confirm_password
        );

        const passwordEl = screen.getByLabelText(
            RegisterAttributes.formLabels.password
        );

        userEvent.type(passwordEl, RegisterAttributes.invalidInputs.password);

        // Check errors
        let passwordErrorEl =
            passwordEl.parentElement?.getElementsByClassName("error-message");

        expect(passwordErrorEl?.length).toBe(1);
        expect(
            passwordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(RegisterAttributes.errors.no_match);

        userEvent.clear(passwordEl);
        userEvent.type(passwordEl, RegisterAttributes.validInputs.password);

        passwordErrorEl =
            passwordEl.parentElement?.getElementsByClassName("error-message");

        expect(passwordErrorEl?.length).toBe(0);
    });
});

test("Succesful register should redirect to Dashboard", async () => {
    const history = createMemoryHistory();
    const unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;
    await submitForm(/register/i, RegisterAttributes.validInputs, /logout/i);

    unmount();
    cleanup();
});
