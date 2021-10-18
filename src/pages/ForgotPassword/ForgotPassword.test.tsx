import { act, cleanup, render } from "../../../test/test-utils";
import ForgotPassword from ".";
import ForgotPasswordAttributes from "../../../test/attributes/ForgotPassword";
import { submitForm } from "../../../test/helpers";

let unmount: any;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    await act(async () => {
        unmount = render(<ForgotPassword />).unmount;
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

test("Notification displays on submit", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    await submitForm(
        /forgot password/i,
        ForgotPasswordAttributes.validAttributes,
        /instructions were emailed to you/i
    );
});
