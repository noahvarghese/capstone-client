import React from "react";
import { store } from "../../store";
import { submitForm } from "../../test/helpers";
import { render, cleanup } from "../../test/test-utils";
import DefaultState from "../../types/state";
import LoginAttributes from "../../test/attributes/LoginForm";
import { createMemoryHistory } from "history";
import App from "../../App";

let unmount: () => void;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeAll(() => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    const history = createMemoryHistory();
    unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;
});

afterEach(() => {
    unmount();
    cleanup();
});

// need to make sure that the user is created
// and apply cleanup
test("Successful login should redirect to the dashboard", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    await submitForm(/login/i, LoginAttributes.validAttributes, /logout/i);
});

test("Invalid login should display error", () => {});
