import { server } from "../lib/permalink";

const login = async <T>(body: T): Promise<void> =>
    new Promise(async (res, rej) => {
        try {
            const response = await fetch(server + "auth/login", {
                method: "POST",
                body: JSON.stringify(body),
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
