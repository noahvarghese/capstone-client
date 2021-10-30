import { act, cleanup, render } from "../../../__test__/test-utils";
import ForgotPassword from ".";
import ForgotPasswordAttributes from "../../../__test__/attributes/ForgotPassword";
import { submitForm } from "../../../__test__/helpers";

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

    await submitForm(ForgotPasswordAttributes.validAttributes, {
        submitBtn: /forgot password/i,
        success: /instructions were emailed to you/i,
    });
});
