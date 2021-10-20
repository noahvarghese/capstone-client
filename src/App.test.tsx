import { render, screen, cleanup, act } from "../test/test-utils";
import App from "./App";
import { createMemoryHistory, MemoryHistory } from "history";

let unmount: () => void;
let history: MemoryHistory<unknown> | undefined;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    jest.resetModules();
    jest.resetModuleRegistry();
    history = createMemoryHistory();
    (fetch as jest.Mock<Promise<Response>>).mockClear();
});

afterEach(() => {
    unmount();
    history = undefined;
    cleanup();
});

test("unauthorized access renders to public page", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    );
    await act(async () => {
        unmount = render(<App />, history).unmount;
    });
    const h1El = screen.getByText(/welcome onboard/i);
    expect(h1El).toBeInTheDocument();
});

test("authorized access renders to dashboard", async () => {
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    );
    (fetch as jest.Mock<Promise<Response>>).mockImplementationOnce(() =>
        Promise.resolve(
            new Response(JSON.stringify([{ name: "test", path: "test" }]), {
                status: 200,
            })
        )
    );

    await act(async () => {
        unmount = render(<App />, history).unmount;
    });
    const h1El = screen.getByText(/home/i);
    expect(h1El).toBeInTheDocument();
});
