import React from "react";
import { cleanup, fireEvent, render, screen } from "../../test/test-utils";
import ResetPassword from ".";
import ResetPasswordAttributes from "../../test/attributes/ResetPassword";
import { fireEmptyChangeEvent } from "../../test/helpers";
import { act } from "react-dom/test-utils";

let unmount: any;

beforeEach(() => {
    act(() => {
        unmount = render(<ResetPassword />).unmount;
    });
});

afterEach(() => {
    unmount();
    cleanup();
});

test("reset notification displays on submit", () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );
    fireEvent.change(passwordEl, {
        target: { value: ResetPasswordAttributes.validInputs.password },
    });

    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );
    fireEvent.change(confirmPasswordEl, {
        target: { value: ResetPasswordAttributes.validInputs.confirmPassword },
    });

    const submitBtn = screen.getByText(/submit/i);
    fireEvent.click(submitBtn);

    const notification = document.getElementsByClassName("Notification");
    expect(notification.length).toBe(1);
    expect(notification[0].classList).toContain("show");
});

test("reset password form's confirm password when empty should show an error message", () => {
    // items that trigger a rerender must be placed within act
    const confirmPasswordInputEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    fireEmptyChangeEvent(confirmPasswordInputEl!, {
        target: {
            value: "yes",
        },
    });

    const confirmPasswordErrorEl = screen.getByText(
        ResetPasswordAttributes.errors.emptyConfirmPassword
    );

    expect(confirmPasswordErrorEl).toBeInTheDocument();
});

test("reset confirm_password is empty should show error message", () => {
    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    fireEmptyChangeEvent(confirmPasswordEl, { target: { value: "yolo" } });

    const errorEl = screen.getByText(
        ResetPasswordAttributes.errors.emptyConfirmPassword
    );

    expect(errorEl).toBeInTheDocument();
});

test("reset password is empty should show error", () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    fireEmptyChangeEvent(passwordEl, { target: { value: "yolo" } });

    const errorEl = screen.getByText(
        ResetPasswordAttributes.errors.emptyPassword
    );

    expect(errorEl).toBeInTheDocument();
});

test("changing confirm password to not match password should show error", () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );
    fireEvent.change(passwordEl, {
        target: { value: ResetPasswordAttributes.invalidInputs.password },
    });

    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );
    fireEvent.change(confirmPasswordEl, {
        target: {
            value: ResetPasswordAttributes.invalidInputs.confirmPassword,
        },
    });

    const confirmPasswordErrorEl =
        confirmPasswordEl.parentElement?.getElementsByClassName(
            "error-message"
        );

    expect(confirmPasswordErrorEl?.length).toBe(1);
    expect(
        confirmPasswordErrorEl![0].getElementsByTagName("p")[0].textContent
    ).toBe(ResetPasswordAttributes.errors.noMatch);
});

test("changing password to not match confirm password should show error", () => {
    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    fireEvent.change(confirmPasswordEl, {
        target: {
            value: ResetPasswordAttributes.invalidInputs.confirmPassword,
        },
    });

    fireEvent.change(passwordEl, {
        target: { value: ResetPasswordAttributes.invalidInputs.password },
    });

    const passwordErrorEl =
        passwordEl.parentElement?.getElementsByClassName("error-message");

    expect(passwordErrorEl?.length).toBe(1);
    expect(passwordErrorEl![0].getElementsByTagName("p")[0].textContent).toBe(
        ResetPasswordAttributes.errors.noMatch
    );
});

test("reset confirm password does not match password when corrected should show no error", () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );
    fireEvent.change(passwordEl, {
        target: { value: ResetPasswordAttributes.invalidInputs.password },
    });

    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );
    fireEvent.change(confirmPasswordEl, {
        target: {
            value: ResetPasswordAttributes.invalidInputs.confirmPassword,
        },
    });
});
