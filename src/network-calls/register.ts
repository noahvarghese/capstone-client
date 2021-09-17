import { server } from "../lib/permalink";

const register = async <T>(body: T): Promise<void> =>
    new Promise<void>(async (res, rej) => {
        try {
            const response = await fetch(server("auth/signup"), {
                method: "POST",
                body: JSON.stringify(body),
            });

            if (response.status === 201) {
                res();
            } else {
                const data = await response.json();
                rej(data);
            }
        } catch (e) {
            rej(e);
        }
    });

export default register;
