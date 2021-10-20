import App from "../../App";
import { submitForm } from "../../../test/helpers";
import { render, cleanup, act } from "../../../test/test-utils";
import RegisterAttributes from "../../../test/attributes/RegisterForm";
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

    await submitForm(/register/i, RegisterAttributes.validInputs, /home/i);

    if (unmount) unmount();
    cleanup();
});
