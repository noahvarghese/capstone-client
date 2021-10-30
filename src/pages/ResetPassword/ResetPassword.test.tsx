import { cleanup, render, act } from "../../../__test__/test-utils";
import ResetPasswordAttributes from "../../../__test__/attributes/ResetPassword";
import { submitForm } from "../../../__test__/helpers";
import App from "src/App";
import { createMemoryHistory } from "history";

let unmount: any;

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

    history.push("/resetPassword/test");
});

afterEach(() => {
    unmount();
    cleanup();
});

test("reset notification displays on submit", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify({ success: true }), {
                status: 201,
            })
        )
    );
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify([{ name: "test", path: "test" }]), {
                status: 200,
            })
        )
    );

    await submitForm(ResetPasswordAttributes.validInputs, {
        success: /home/i,
        submitBtn: /reset password/i,
    });
});
