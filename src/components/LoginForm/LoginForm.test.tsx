import React from "react";
import { store } from "../../store";
import { submitForm } from "../../test/helpers";
import { render, cleanup, screen } from "../../test/test-utils";
import DefaultState from "../../types/state";
import LoginAttributes from "../../test/attributes/LoginForm";
import { createMemoryHistory } from "history";
import App from "../../App";

let unmount: () => void;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(() => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    // prevents the user from being auto logged in with successful response
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );

    const history = createMemoryHistory();

    unmount = render(
        <App />,
        { preloadedState: DefaultState, currentStore: store },
        history
    ).unmount;
});

test("Invalid login should display error", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify({ message: "Invalid login" }), {
                status: 400,
            })
        )
    );

    try {
        await submitForm(
            /login/i,
            {
                email: LoginAttributes.invalidAttributes.invalidEmail,
                password: LoginAttributes.validAttributes.password,
            },
            /logout/i
        );
        throw new Error("Should not be succesful");
    } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e.message).toContain(
            "Unable to find an element with the text: /logout/i"
        );
    }
});

// need to make sure that the user is created
// and apply cleanup
test("Successful login should redirect to the dashboard", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    await submitForm(/login/i, LoginAttributes.validAttributes, /logout/i);
});

afterEach(() => {
    unmount();
    cleanup();
});
