import React from "react";
import { fireEvent, render, screen } from "./test/test-utils";
import App from "./App";
import { changeAllInputs } from "./test/helpers";
import RegisterAttributes from "./components/RegisterForm/RegisterForm.test";

beforeEach(() => {
    render(<App />);
});

test("renders to public page", () => {
    const h1El = screen.getByText(/welcome onboard/i);
    expect(h1El).toBeInTheDocument();
});

test("Succesful register should redirect to Dashboard", () => {
    const formName = /register/i;

    const goToRegisterButton = Array.from(
        document.getElementsByTagName("button")
    ).find((el) => formName.test(el.textContent ?? ""));

    if (!goToRegisterButton) throw new Error("Register button not found");

    fireEvent.click(goToRegisterButton);

    changeAllInputs(RegisterAttributes.validInputs);

    // get the button that has the text "register"
    const submitBtn = Array.from(document.getElementsByTagName("button")).find(
        (el) => formName.test(el.textContent ?? "")
    );

    if (!submitBtn) throw new Error("submit button not found");

    fireEvent.click(submitBtn);

    const homeHeader = screen.getByText(/home/i);
    expect(homeHeader).toBeInTheDocument();
});
