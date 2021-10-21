import { cleanup, render, act, screen } from "../../../test/test-utils";
import Member from "./";
import InviteAttributes from "../../../test/attributes/InviteAttributes";
import { createMemoryHistory } from "history";
import { submitForm } from "../../../test/helpers";
import userEvent from "@testing-library/user-event";
import { members } from "../../../test/attributes/Members";

let unmount: any;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    // checks if logged in only needed for app
    // (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
    //     Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    // );
    // nav call
    // (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
    //     Promise.resolve(
    //         new Response(JSON.stringify([{ name: "home", link: "/" }]), {
    //             status: 200,
    //         })
    //     )
    // );

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(JSON.stringify({ data: members }), {
                status: 200,
            })
        )
    );

    const history = createMemoryHistory();
    await act(async () => {
        unmount = render(<Member />, history).unmount;
    });
    await act(async () => {
        userEvent.click(screen.getByText(/^invite$/i, { selector: "button" }));
    });
});

test("Valid parameters show success notification", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify({}), {
                status: 200,
            })
        )
    );
    await submitForm(InviteAttributes.validInputs, {
        success: /Invite sent/i,
        submitBtn: /Send Invite/i,
    });
});

test("Invalid parameters show error notification", async () => {
    const errorMessage = "this sucks";
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify({ message: errorMessage }), {
                status: 400,
            })
        )
    );
    await submitForm(InviteAttributes.validInputs, {
        success: errorMessage,
        submitBtn: /send invite/i,
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
