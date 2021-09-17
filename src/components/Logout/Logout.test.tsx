import React from "react";
import { createMemoryHistory } from "history";
import App from "../../App";
import { store } from "../../store";
import { cleanup, render, screen, waitFor } from "../../test/test-utils";
import DefaultState from "../../types/state";
import userEvent from "@testing-library/user-event";

let unmount: () => void;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeAll(() => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();

    // Allows user to be logged in
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    const history = createMemoryHistory();

    unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;
});

test("Logged in user can logout to login screen", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );

    const logout = await screen.findByText(/logout/i);

    userEvent.click(logout);

    await waitFor(async () => {
        const h1 = await screen.findByText(/welcome onboard/i);
        expect(h1).toBeInTheDocument();
    });
});

afterEach(() => {
    unmount();
    cleanup();
});
