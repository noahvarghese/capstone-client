import { render, cleanup, act } from "../../../test/test-utils";

import { submitForm } from "../../../test/helpers";
import LoginAttributes from "../../../test/attributes/LoginForm";
import { createMemoryHistory } from "history";
import App from "../../App";

let unmount: () => void;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );

    const history = createMemoryHistory();

    await act(async () => {
        unmount = render(<App />, history).unmount;
    });
});

test("Invalid login should display error", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
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

afterEach(async () => {
    await act(async () => {
        unmount();
    });
    await act(async () => {
        cleanup();
    });
});
