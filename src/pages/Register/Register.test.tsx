import App from "../../App";
import { submitForm } from "../../../__test__/helpers";
import { render, cleanup, act } from "../../../__test__/test-utils";
import RegisterAttributes from "../../../__test__/attributes/RegisterForm";
import { createMemoryHistory } from "history";

let unmount: () => void;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    const history = createMemoryHistory();
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );
    await act(async () => {
        unmount = render(<App />, history).unmount;
    });
    history.push("/register");
});

test("Succesful register should redirect to Dashboard", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 201 }))
    );

    await submitForm(RegisterAttributes.validInputs, {
        success: /home/i,
        submitBtn: /register/i,
    });

    if (unmount) unmount();
    cleanup();
});
