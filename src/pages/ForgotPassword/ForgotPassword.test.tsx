import React from "react";
import { render, screen } from "../../test/test-utils";
import ForgotPassword from ".";
import ForgotPasswordAttributes from "../../test/attributes/ForgotPassword";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
    render(<ForgotPassword />);
});

test("Notification doesn't display when email is empty", () => {
    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );

    userEvent.type(emailEl, ForgotPasswordAttributes.validAttributes.email);
    userEvent.clear(emailEl);

    const submitBtn = screen.getByText(/submit/i);
    userEvent.click(submitBtn);

    const notification = document.getElementsByClassName("Notification");
    expect(notification.length).toBe(1);
    expect(notification[0].classList).not.toContain("show");
});

test("Notification displays on submit", () => {
    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );
    userEvent.type(emailEl, ForgotPasswordAttributes.validAttributes.email);

    const submitBtn = screen.getByText(/submit/i);
    userEvent.click(submitBtn);

    const notification = document.getElementsByClassName("Notification");
    expect(notification.length).toBe(1);
    expect(notification[0].classList).toContain("show");
});
