import { fetchWithCredentials } from "../lib/fetchHelper";
import { server } from "../lib/permalink";

export const checkAuthenticated = async (): Promise<void> =>
    new Promise<void>(async (res, rej) => {
        const response = await fetchWithCredentials(server("auth"), {
            method: "POST",
        });

        if (response.status === 200) {
            res();
        } else rej();
    });
