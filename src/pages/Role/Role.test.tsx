import {
    cleanup,
    render,
    act,
    screen,
    waitFor,
} from "../../../test/test-utils";
import { createMemoryHistory } from "history";
import Role from ".";
import userEvent from "@testing-library/user-event";

const roles = [
    {
        name: "General",
        department: "Admin",
        id: 1,
        numMembers: 3,
    },
    {
        name: "Management",
        department: "Front of House",
        id: 2,
        numMembers: 2,
    },
    {
        name: "Managment",
        department: "Back of House",
        id: 3,
        numMembers: 2,
    },
    {
        name: "Management",
        department: "Bar",
        id: 4,
        numMembers: 2,
    },
    {
        name: "Barista",
        department: "Bar",
        id: 5,
        numMembers: 4,
    },
    {
        name: "Chef",
        department: "Back of House",
        id: 6,
        numMembers: 2,
    },
    {
        name: "Line Cook",
        department: "Back of House",
        id: 7,
        numMembers: 3,
    },
    {
        name: "Dishwasher",
        department: "Back of House",
        id: 8,
        numMembers: 4,
    },
    {
        name: "Server",
        department: "Front of House",
        id: 9,
        numMembers: 8,
    },
    {
        name: "Host",
        department: "Front of House",
        id: 10,
        numMembers: 5,
    },
    {
        name: "Bussers",
        department: "Front of House",
        id: 11,
        numMembers: 4,
    },
];

let unmount: any;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(JSON.stringify({ data: roles }), {
                status: 200,
            })
        )
    );

    const history = createMemoryHistory();
    await act(async () => {
        unmount = render(<Role />, history).unmount;
    });
});

afterEach(() => {
    unmount();
    cleanup();
});

test("Renders correctly", async () => {
    for (const item of roles) {
        const searchItem = item.name + item.department + item.numMembers;
        expect(
            screen.getByText(
                (_, element) => element?.textContent === searchItem
            )
        ).toBeInTheDocument();
    }
});

test("Delete opens dialog", async () => {
    await act(async () => {
        userEvent.click(screen.getByText(roles[0].name));
    });
    await act(async () => {
        userEvent.click(screen.getByRole("button", { name: /delete/i }));
    });
    expect(screen.getByText("Delete Role")).toBeInTheDocument();
});

test("create opens dialog", async () => {
    await act(async () => {
        userEvent.click(screen.getByText(/create/i));
    });
    expect(
        screen.getByText(
            (_, element) =>
                /button/i.test(element?.tagName ?? "") &&
                /create role/i.test(element?.textContent ?? "")
        )
    ).toBeInTheDocument();
});

test("refreshing table", async () => {
    let newRoles = roles.concat([
        {
            name: "test",
            id: 22,
            department: "test",
            numMembers: 22,
        },
    ]);

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(
                JSON.stringify({
                    data: newRoles,
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
        for (const item of newRoles) {
            const searchItem = item.name + item.department + item.numMembers;
            expect(
                screen.getByText(
                    (_, element) => element?.textContent === searchItem
                )
            ).toBeInTheDocument();
        }
    });
});

test.todo("sorting table");
test.todo("filtering table");
test.todo("paginating table");
test.todo("editing table");
