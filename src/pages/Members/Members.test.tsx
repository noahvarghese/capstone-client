import {
    cleanup,
    render,
    act,
    screen,
    waitFor,
} from "../../../test/test-utils";
import { createMemoryHistory } from "history";
import Members from ".";
import userEvent from "@testing-library/user-event";

const members = [
    {
        name: "Noah Varghese",
        email: "varghese.noah@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 1,
    },
    {
        name: "Josh Varghese",
        email: "vjosh76@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 2,
    },
    {
        name: "Elijah Varghese",
        email: "vargheli2500.noah@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 3,
    },
    {
        name: "Neha Varghese",
        email: "neha@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 4,
    },
    {
        name: "Angela Schon",
        email: "avarghese3@cogeco.ca",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 5,
    },
    {
        name: "Matt Varghese",
        email: "imanjen@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 6,
    },
    {
        name: "Julia Baillie",
        email: "juliabaillie04@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 7,
    },
    {
        name: "Trsitan Osena",
        email: "1kataking@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 8,
    },
    {
        name: "Isabel Osena",
        email: "izzy@gmail.com",
        phone: "6477715777",
        birthday: new Date(1996, 8, 7),
        id: 9,
    },
];

let unmount: any;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(JSON.stringify({ data: members }), {
                status: 200,
            })
        )
    );

    const history = createMemoryHistory();
    await act(async () => {
        unmount = render(<Members />, history).unmount;
    });
});

test("Renders correctly", async () => {
    for (const item of members) {
        expect(screen.getByText(item.name)).toBeInTheDocument();
    }
});

test("Delete opens dialog", async () => {
    await act(async () => {
        userEvent.click(screen.getByText(members[0].name));
    });
    await act(async () => {
        userEvent.click(screen.getByRole("button", { name: /delete/i }));
    });
    expect(screen.getByText("Delete Member")).toBeInTheDocument();
});

test("Invite opens dialog", async () => {
    await act(async () => {
        userEvent.click(screen.getByText(/invite/i));
    });
    expect(screen.getByText(/send invite/i)).toBeInTheDocument();
});

test("refreshing table", async () => {
    let newMembers = members.concat([
        {
            name: "test",
            email: "test@test.com",
            birthday: new Date(2020, 1, 1),
            phone: "2898379585",
            id: 22,
        },
    ]);

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(
                JSON.stringify({
                    data: newMembers,
                }),
                {
                    status: 200,
                }
            )
        )
    );
    await act(async () => {
        userEvent.click(screen.getByRole("button", { name: /refresh/i }));
    });

    await waitFor(async () => {
        for (const item of newMembers) {
            expect(screen.getByText(item.name)).toBeInTheDocument();
        }
    });
});

test.todo("sorting table");
test.todo("filtering table");
test.todo("paginating table");
test.todo("editing table");

afterEach(() => {
    unmount();
    cleanup();
});
