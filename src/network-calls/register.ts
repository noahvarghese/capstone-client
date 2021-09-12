import { server } from "../lib/permalink";

const register = async <T>(
    body: T
): Promise<true | { field: keyof T; message: string }> => {
    const response = await fetch(server + "auth/signup", {
        body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response.status === 201) {
        return true;
    } else return data;
};

export default register;
