import React from "react";
import LoginForm from ".";
import { fireEmptyChangeEvent } from "../../test/helpers";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";

const validLoginAttributes = {
    email: "test@test.com",
    password: "testtest",
};

const invalidLoginAttributes = {
    notEmail: "test",
    invalidEmail: "test123@test.com",
    password: "yoloyolo",
};

const errors = {
    invalidEmail: "Invalid email",
    emptyEmail: "Email cannot be empty",
    emptyPassword: "password cannot be empty",
};

const formLabels = {
    email: /email/i,
    password: /password/i,
};

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
    const emailInput = screen.getByLabelText(formLabels.email);
    expect(emailInput).toBeInTheDocument();

    fireEvent.change(emailInput, {
        target: { value: validLoginAttributes.email },
    });

    expect((emailInput as any).value).toBe(validLoginAttributes.email);

    const passwordInput = screen.getByLabelText(formLabels.password);
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, {
        target: { value: validLoginAttributes.password },
    });

    expect((passwordInput as any).value).toBe(validLoginAttributes.password);
});

test("invalid email", () => {
    let emailError = screen.queryByText(errors.invalidEmail);
    expect(emailError).not.toBeInTheDocument();

    const emailInput = screen.getByLabelText(formLabels.email);

    fireEvent.change(emailInput, {
        target: { value: invalidLoginAttributes.notEmail },
    });

    emailError = screen.getByText(errors.invalidEmail);
    expect(emailError).toBeInTheDocument();
});

test("empty email", async () => {
    let emailError = screen.queryByText(errors.emptyEmail);
    expect(emailError).not.toBeInTheDocument();

    const emailInput = screen.getByLabelText(formLabels.email);

    fireEmptyChangeEvent(emailInput, {
        target: { value: invalidLoginAttributes.notEmail },
    });

    await waitFor(() =>
        expect(screen.getByText(errors.emptyEmail)).toBeInTheDocument()
    );
});

test("empty password", async () => {
    let pwdError = screen.queryByText(errors.emptyPassword);
    expect(pwdError).not.toBeInTheDocument();

    const pwdInput = screen.getByLabelText(formLabels.password);

    fireEmptyChangeEvent(pwdInput, {
        target: { value: invalidLoginAttributes.password },
    });

    await waitFor(() =>
        expect(screen.getByText(errors.emptyPassword)).toBeInTheDocument()
    );
});
