import { server } from "../lib/permalink";

const login = async <T>(
    body: T
): Promise<true | { field: keyof Text; message: string }> => {
    const response = await fetch(server + "auth/login", {
        body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response.status === 200) {
        return true;
    } else return data;
};

export default login;
