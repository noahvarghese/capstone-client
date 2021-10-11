import { fetchWithCredentials } from "../lib/fetchHelper";
import { server } from "../lib/permalink";

const login = async <T>(body: T): Promise<void> => {
    const url = server("auth/login");

    const response = await fetchWithCredentials(url, {
        body: JSON.stringify(body),
        method: "POST",
    });

    if (response.status === 200) {
        return;
    } else {
        const { message } = await response.json();
        throw new Error(message);
    }
};

export default login;
