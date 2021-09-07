import React from "react";
import LoginForm from ".";
import { fireEmptyChangeEvent } from "../../test/helpers";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import LoginAttributes from "./testAttributes";
beforeEach(() => {
    render(
        <LoginForm
            setForm={() => {
                return;
            }}
        />
    );
});

// need to make sure that the user is created
// and apply cleanup
test("Valid login", () => {
    const emailInput = screen.getByLabelText(LoginAttributes.formLabels.email);
    expect(emailInput).toBeInTheDocument();

    fireEvent.change(emailInput, {
        target: { value: LoginAttributes.validAttributes.email },
    });

    expect((emailInput as any).value).toBe(
        LoginAttributes.validAttributes.email
    );

    const passwordInput = screen.getByLabelText(
        LoginAttributes.formLabels.password
    );
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, {
        target: { value: LoginAttributes.validAttributes.password },
    });

    expect((passwordInput as any).value).toBe(
        LoginAttributes.validAttributes.password
    );
});

test("invalid email", () => {
    let emailError = screen.queryByText(LoginAttributes.errors.invalidEmail);
    expect(emailError).not.toBeInTheDocument();

    const emailInput = screen.getByLabelText(LoginAttributes.formLabels.email);

    fireEvent.change(emailInput, {
        target: { value: LoginAttributes.invalidAttributes.notEmail },
    });

    emailError = screen.getByText(LoginAttributes.errors.invalidEmail);
    expect(emailError).toBeInTheDocument();
});

test("empty email", async () => {
    let emailError = screen.queryByText(LoginAttributes.errors.emptyEmail);
    expect(emailError).not.toBeInTheDocument();

    const emailInput = screen.getByLabelText(LoginAttributes.formLabels.email);

    fireEmptyChangeEvent(emailInput, {
        target: { value: LoginAttributes.invalidAttributes.notEmail },
    });

    await waitFor(() =>
        expect(
            screen.getByText(LoginAttributes.errors.emptyEmail)
        ).toBeInTheDocument()
    );
});

test("empty password", async () => {
    let pwdError = screen.queryByText(LoginAttributes.errors.emptyPassword);
    expect(pwdError).not.toBeInTheDocument();

    const pwdInput = screen.getByLabelText(LoginAttributes.formLabels.password);

    fireEmptyChangeEvent(pwdInput, {
        target: { value: LoginAttributes.invalidAttributes.password },
    });

    await waitFor(() =>
        expect(
            screen.getByText(LoginAttributes.errors.emptyPassword)
        ).toBeInTheDocument()
    );
});
