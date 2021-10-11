import React from "react";
import Login from ".";
import { fireEvent, render, screen } from "../../../test/test-utils";

test("login form is displayed", () => {
    render(<Login />);
    const loginEls = screen.getAllByText(/login/i);

    expect(loginEls.length).toBe(2);
    expect(loginEls[0]).toBeInstanceOf(HTMLHeadingElement);
    expect(loginEls[0]).toBeInTheDocument();
    expect(loginEls[1]).toBeInstanceOf(HTMLButtonElement);
    expect(loginEls[1]).toBeInTheDocument();
});

test("can change between login and register", () => {
    render(<Login />);

    const registerBtn = screen.getByText(/register/i);

    fireEvent.click(registerBtn);

    const registerEls = screen.getAllByText(/register/i);
    expect(registerEls.length).toBe(2);
    expect(registerEls[0]).toBeInstanceOf(HTMLHeadingElement);
    expect(registerEls[0]).toBeInTheDocument();
});
