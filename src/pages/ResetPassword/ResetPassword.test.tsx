import React from "react";
import { cleanup, render, screen, waitFor } from "../../test/test-utils";
import ResetPassword from ".";
import ResetPasswordAttributes from "../../test/attributes/ResetPassword";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

let unmount: any;

global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(() => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    act(() => {
        unmount = render(<ResetPassword />).unmount;
    });
});

afterEach(() => {
    unmount();
    cleanup();
});

test("reset notification displays on submit", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify({ success: true }), {
                status: 201,
            })
        )
    );

    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    userEvent.type(passwordEl, ResetPasswordAttributes.validInputs.password);
    userEvent.type(
        confirmPasswordEl,
        ResetPasswordAttributes.validInputs.confirmPassword
    );

    const submitBtn = screen.getByText(/submit/i);
    userEvent.click(submitBtn);

    await waitFor(() => {
        const notification = document.getElementsByClassName("Notification");
        expect(notification.length).toBe(1);
        expect(notification[0].classList).toContain("show");
    });
});

test("reset password form's confirm password when empty should show an error message", () => {
    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    userEvent.type(confirmPasswordEl, "yolo");
    userEvent.clear(confirmPasswordEl);

    const errorEl = screen.getByText(
        ResetPasswordAttributes.errors.emptyConfirmPassword
    );

    expect(errorEl).toBeInTheDocument();
});

test("reset password is empty should show error", () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    userEvent.type(passwordEl, "yolo");
    userEvent.clear(passwordEl);

    const errorEl = screen.getByText(
        ResetPasswordAttributes.errors.emptyPassword
    );

    expect(errorEl).toBeInTheDocument();
});

test("changing confirm password to not match password should show error", async () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    userEvent.type(passwordEl, ResetPasswordAttributes.validInputs.password);

    userEvent.type(
        confirmPasswordEl,
        ResetPasswordAttributes.invalidInputs.confirmPassword
    );

    await waitFor(() => {
        const confirmPasswordErrorEl =
            confirmPasswordEl.parentElement?.getElementsByClassName(
                "error-message"
            );

        expect(confirmPasswordErrorEl?.length).toBe(1);
        expect(
            confirmPasswordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(ResetPasswordAttributes.errors.noMatch);
    });
});

test("changing password to not match confirm password should show error", async () => {
    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    userEvent.type(
        confirmPasswordEl,
        ResetPasswordAttributes.validInputs.confirmPassword
    );

    userEvent.type(passwordEl, ResetPasswordAttributes.invalidInputs.password);

    await waitFor(() => {
        const passwordErrorEl =
            passwordEl.parentElement?.getElementsByClassName("error-message");

        expect(passwordErrorEl?.length).toBe(1);
        expect(
            passwordErrorEl![0].getElementsByTagName("p")[0].textContent
        ).toBe(ResetPasswordAttributes.errors.noMatch);
    });
});

test("reset confirm password does not match password when corrected should show no error", async () => {
    const passwordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.password
    );

    userEvent.type(passwordEl, ResetPasswordAttributes.validInputs.password);

    const confirmPasswordEl = screen.getByLabelText(
        ResetPasswordAttributes.formLabels.confirmPassword
    );

    userEvent.type(
        confirmPasswordEl,
        ResetPasswordAttributes.invalidInputs.confirmPassword
    );

    expect(confirmPasswordEl.parentElement?.classList).toContain("error");

    userEvent.clear(confirmPasswordEl);
    userEvent.type(
        confirmPasswordEl,
        ResetPasswordAttributes.validInputs.confirmPassword
    );

    await waitFor(() => {
        expect(confirmPasswordEl.parentElement?.classList).not.toContain(
            "error"
        );
    });
});
