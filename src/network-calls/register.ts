import { fetchWithCredentials } from "../lib/fetchHelper";
import { server } from "../lib/permalink";

const register = async <T>(body: T): Promise<void> => {
    const response = await fetchWithCredentials(server("auth/signup"), {
        body: JSON.stringify(body),
        method: "POST",
    });

    if (response.status === 201) {
        return;
    } else {
        const data = await response.json();
        throw new Error(data);
    }
};

export default register;
