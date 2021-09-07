import React from "react";
import { render, screen } from "./test/test-utils";
import App from "./App";
import { submitForm } from "./test/helpers";
import RegisterAttributes from "./components/RegisterForm/testAttributes";
import LoginAttributes from "./components/LoginForm/testAttributes";

beforeEach(() => {
    render(<App />);
});

test("renders to public page", () => {
    const h1El = screen.getByText(/welcome onboard/i);
    expect(h1El).toBeInTheDocument();
});

test("Succesful register should redirect to Dashboard", () => {
    submitForm(/register/i, RegisterAttributes.validInputs, /home/i);
});

test("Successful login should redirect to the dashbaord", () => {
    submitForm(/login/i, LoginAttributes.validAttributes, /home/i);
});
