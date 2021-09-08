import React from "react";
import { render, screen, cleanup } from "./test/test-utils";
import App from "./App";
import { createMemoryHistory } from "history";
import DefaultState from "./types/state";
import { store } from "./store";

let unmount: () => void;
let history;

beforeEach(() => {
    jest.resetModules();
    jest.resetModuleRegistry();
    history = createMemoryHistory();
    unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;
});

afterEach(() => {
    unmount();
    history = undefined;
    cleanup();
});

test("renders to public page", () => {
    const h1El = screen.getByText(/welcome onboard/i);
    expect(h1El).toBeInTheDocument();
});
