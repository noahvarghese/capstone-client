import { server } from "../lib/permalink";

const login = async <T>(body: T): Promise<void> =>
    new Promise(async (res, rej) => {
        try {
            const response = await fetch(server + "auth/login", {
                method: "POST",
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (response.status === 200) {
                res();
            } else rej(data);
        } catch (e) {
            rej(e);
        }
    });

export default login;
