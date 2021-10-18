import {
    render,
    screen,
    cleanup,
    act,
    waitFor,
} from "../../../test/test-utils";
import App from "../../App";
import { createMemoryHistory } from "history";

test("wrong url should display 404 page", async () => {
    const history = createMemoryHistory();
    let unmount: (() => void) | undefined;

    global.fetch = jest.fn(() => Promise.resolve(new Response()));
    (fetch as jest.Mock<Promise<Response>>).mockClear();
    // prevents the user from being auto logged in with successful response

    // renders twice
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );

    await act(async () => {
        unmount = render(<App />, history).unmount;
    });

    history.push("/some/bad/route");

    await waitFor(async () => {
        expect(screen.getByText(/404 file not found/i)).toBeInTheDocument();
    });

    if (unmount) unmount();
    cleanup();
});
