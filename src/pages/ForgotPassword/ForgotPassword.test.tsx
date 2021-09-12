import React from "react";
import { act, cleanup, render, screen, waitFor } from "../../test/test-utils";
import ForgotPassword from ".";
import ForgotPasswordAttributes from "../../test/attributes/ForgotPassword";
import userEvent from "@testing-library/user-event";

let unmount: any;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(() => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    act(() => {
        unmount = render(<ForgotPassword />).unmount;
    });
});

afterEach(() => {
    unmount();
    cleanup();
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

test("Notification displays on submit", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    const emailEl = screen.getByLabelText(
        ForgotPasswordAttributes.formLabels.email
    );
    userEvent.type(emailEl, ForgotPasswordAttributes.validAttributes.email);

    const submitBtn = screen.getByText(/submit/i);
    userEvent.click(submitBtn);

    await waitFor(() => {
        const notification = document.getElementsByClassName("Notification");
        expect(notification.length).toBe(1);
        expect(notification[0].classList).toContain("show");
    });
});
