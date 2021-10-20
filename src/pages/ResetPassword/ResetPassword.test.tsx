import { cleanup, render } from "../../../test/test-utils";
import ResetPasswordAttributes from "../../../test/attributes/ResetPassword";
import { act } from "react-dom/test-utils";
import { submitForm } from "../../../test/helpers";
import App from "src/App";
import { createMemoryHistory } from "history";

let unmount: any;

global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    global.fetch = jest.fn(() => Promise.resolve(new Response()));
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

    await submitForm(
        /reset password/i,
        ResetPasswordAttributes.validInputs,
        /logout/i
    );
});
