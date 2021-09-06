import React from "react";
import RegisterForm from ".";
import { fireEmptyChangeEvent } from "../../test/helpers";
import { render, screen, fireEvent } from "../../test/test-utils";

const formLabels = {
    password: /^\* password$/i,
    confirmPassword: /confirm password/i,
};

const validInputs = {
    password: "testtest",
    confirmPassword: "testtest",
};

const invalidInputs = {
    password: "testttt",
    confirmPassword: "testtest",
};

const errors = {
    emptyPassword: /^password cannot be empty$/i,
    emptyConfirmPassword: /^confirm_password cannot be empty$/i,
};

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
    const confirmPasswordEl = screen.getByLabelText(formLabels.confirmPassword);

    fireEmptyChangeEvent(confirmPasswordEl, { target: { value: "yolo" } });

    const errorEl = screen.getByText(errors.emptyConfirmPassword);

    expect(errorEl).toBeInTheDocument();
});

test("password is empty should show error", () => {
    const passwordEl = screen.getByLabelText(formLabels.password);

    fireEmptyChangeEvent(passwordEl, { target: { value: "yolo" } });

    const errorEl = screen.getByText(errors.emptyPassword);

    expect(errorEl).toBeInTheDocument();
});

test("confirm password does not match password should show error", () => {});

test("password does not match confirm password should show error", () => {});
