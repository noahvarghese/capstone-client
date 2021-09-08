import React from "react";
import { fireEvent, render, screen } from "../../test/test-utils";
import ForgotPassword from ".";
import ForgotPasswordAttributes from "../../test/attributes/ForgotPassword";
import { fireEmptyChangeEvent } from "../../test/helpers";

beforeEach(() => {
    render(<ForgotPassword />);
});

test("Error displays when email is left empty", () => {
    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );

    fireEmptyChangeEvent(emailEl, {
        target: { value: ForgotPasswordAttributes.validAttributes.email },
    });

    const errorEl = screen.getByText(
        ForgotPasswordAttributes.errors.emptyEmail
    );
    expect(errorEl).toBeInTheDocument();
});

test("Error displays when email is invalid", () => {
    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );

    fireEvent.change(emailEl, {
        target: { value: ForgotPasswordAttributes.invalidAttributes.email },
    });

    const errorEl = screen.getByText(
        ForgotPasswordAttributes.errors.invalidEmail
    );
    expect(errorEl).toBeInTheDocument();
});

test("Notification doesn't display when email is empty", () => {
    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );

    fireEmptyChangeEvent(emailEl, {
        target: { value: ForgotPasswordAttributes.validAttributes.email },
    });

    const submitBtn = screen.getByText(/submit/i);
    fireEvent.click(submitBtn);

    const notification = document.getElementsByClassName("Notification");
    expect(notification.length).toBe(1);
    expect(notification[0].classList).not.toContain("show");
});

test("Notification displays on submit", () => {
    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );
    fireEvent.change(emailEl, {
        target: { value: ForgotPasswordAttributes.validAttributes.email },
    });

    const submitBtn = screen.getByText(/submit/i);
    fireEvent.click(submitBtn);

    const notification = document.getElementsByClassName("Notification");
    expect(notification.length).toBe(1);
    expect(notification[0].classList).toContain("show");
});
