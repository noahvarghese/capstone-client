import React from "react";
import { render, screen, cleanup } from "../../../test/test-utils";
import App from "../../App";
import { createMemoryHistory } from "history";
import DefaultState from "../../types/state";
import { store } from "../../store";

test("wrong url should display 404 page", () => {
    const history = createMemoryHistory();
    const unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;

    history.push("/some/bad/route");

    const notFoundEl = screen.getByText(/404 file not found/i);
    expect(notFoundEl).toBeInTheDocument();

    unmount();
    cleanup();
});
