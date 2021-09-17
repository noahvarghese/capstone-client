import { fetchWithCredentials } from "../lib/fetchHelper";
import { server } from "../lib/permalink";

const login = async <T>(body: T): Promise<void> =>
    new Promise(async (res, rej) => {
        try {
            const url = server("auth/login");

            const response = await fetchWithCredentials(url, {
                body: JSON.stringify(body),
                method: "POST",
            });

            if (response.status === 200) {
                res();
            } else {
                const data = await response.json();
                rej(data);
            }
        } catch (e) {
            console.log(e);
            rej(e);
        }
    });

export default login;
