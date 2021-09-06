import React from "react";
import { render, screen } from "./test/test-utils";
import App from "./App";

test("renders learn react link", () => {
    render(<App />);
    const h1El = screen.getByText(/welcome onboard/i);
    expect(h1El).toBeInTheDocument();
});
