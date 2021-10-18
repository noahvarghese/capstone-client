import { createMemoryHistory, MemoryHistory } from "history";
import App from "../../App";
import {
    act,
    cleanup,
    render,
    screen,
    waitFor,
} from "../../../test/test-utils";

let unmount: () => void;
let history: MemoryHistory<unknown>;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();

    // Allows user to be logged in
    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    history = createMemoryHistory();

    await act(async () => {
        unmount = render(<App />, history).unmount;
    });
});

test("Logged in user can logout to login screen", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );

    history.push("/logout");

    await waitFor(async () => {
        expect(await screen.findByText(/welcome onboard/i)).toBeInTheDocument();
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
