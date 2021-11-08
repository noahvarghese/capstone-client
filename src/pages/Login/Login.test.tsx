import { render, cleanup, act } from "../../../__test__/test-utils";

import { submitForm } from "../../../__test__/helpers";
import LoginAttributes from "../../../__test__/attributes/LoginForm";
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
            {
                email: LoginAttributes.invalidAttributes.invalidEmail,
                password: LoginAttributes.validAttributes.password,
            },
            {
                success: /home/i,
                submitBtn: /login/i,
            }
        );
        throw new Error("Should not be succesful");
    } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e.message).toContain(
            "Unable to find an element with the text: /home/i"
        );
    }
});

// need to make sure that the user is created
// and apply cleanup
test("Successful login should redirect to the dashboard", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    await submitForm(LoginAttributes.validAttributes, {
        success: /home/i,
        submitBtn: /login/i,
    });
});

afterEach(async () => {
    await act(async () => {
        unmount();
    });
    await act(async () => {
        cleanup();
    });
});
