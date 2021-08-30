import React from "react";
import { render, fireEvent, screen } from "./test/test-utils";
import App from "./App";

test("renders learn react link", () => {
    render(<App />);
    // const linkElement = screen.getByText(/learn react/i);
    // expect(linkElement).toBeInTheDocument();
});
