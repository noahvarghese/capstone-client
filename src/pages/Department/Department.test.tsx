import {
    cleanup,
    render,
    act,
    screen,
    waitFor,
} from "../../../test/test-utils";
import { createMemoryHistory } from "history";
import Department from ".";
import userEvent from "@testing-library/user-event";

const departments = [
    {
        name: "Admin",
        id: 1,
        numMembers: 3,
        numRoles: 3,
    },
    {
        name: "Accounting",
        id: 2,
        numMembers: 10,
        numRoles: 5,
    },
    {
        name: "Finance",
        id: 3,
        numMembers: 35,
        numRoles: 10,
    },
    {
        name: "HR",
        id: 4,
        numMembers: 5,
        numRoles: 3,
    },
    {
        name: "Marketing",
        id: 5,
        numMembers: 4,
        numRoles: 3,
    },
    {
        name: "IT",
        id: 6,
        numMembers: 10,
        numRoles: 3,
    },
    {
        name: "R&D",
        id: 7,
        numMembers: 30,
        numRoles: 10,
    },
    {
        name: "Strategy",
        id: 8,
        numMembers: 4,
        numRoles: 4,
    },
    {
        name: "Operations",
        id: 9,
        numMembers: 8,
        numRoles: 4,
    },
];

let unmount: any;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(async () => {
    (fetch as jest.Mock<Promise<Response>>).mockClear();

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(JSON.stringify({ data: departments }), {
                status: 200,
            })
        )
    );

    const history = createMemoryHistory();
    await act(async () => {
        unmount = render(<Department />, history).unmount;
    });
});

afterEach(() => {
    unmount();
    cleanup();
});

afterEach(() => {
    unmount();
    cleanup();
});

test("Renders correctly", async () => {
    for (const item of departments) {
        const searchItem = item.name + item.numMembers + item.numRoles;
        expect(
            screen.getByText(
                (_, element) => element?.textContent === searchItem
            )
        ).toBeInTheDocument();
    }
});

test("Delete opens dialog", async () => {
    await act(async () => {
        userEvent.click(screen.getByText(departments[0].name));
    });
    await act(async () => {
        userEvent.click(screen.getByRole("button", { name: /delete/i }));
    });
    expect(
        screen.getByText(/delete department/i, { selector: "h2" })
    ).toBeInTheDocument();
});

test("create opens dialog", async () => {
    await act(async () => {
        userEvent.click(screen.getByText(/create/i));
    });
    expect(screen.getByText(/create department/i)).toBeInTheDocument();
});

test("refreshing table", async () => {
    let newDepartments = departments.concat([
        {
            name: "test",
            id: 22,
            numMembers: 22,
            numRoles: 40,
        },
    ]);

    (fetch as jest.Mock<Promise<Response>>).mockImplementation(() =>
        Promise.resolve(
            new Response(
                JSON.stringify({
                    data: newDepartments,
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
        for (const item of newDepartments) {
            expect(screen.getByText(item.name)).toBeInTheDocument();
        }
    });
});

test.todo("sorting table");
test.todo("filtering table");
test.todo("paginating table");
test.todo("editing table");
