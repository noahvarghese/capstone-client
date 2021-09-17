import { fetchWithCredentials } from "../lib/fetchHelper";
import { server } from "../lib/permalink";

export const requestResetPassword = async (
    params: unknown
): Promise<true | { message: string }> => {
    const response = await fetchWithCredentials(
        server("auth/requestResetPassword"),
        { body: JSON.stringify(params), method: "POST" }
    );

    if (response.status !== 200) {
        const { message } = await response.json();
        return { message };
    }
    return true;
};

export const submitNewPassword = async <T>(
    token: string,
    params: T
): Promise<void> =>
    new Promise<void>(async (res, rej) => {
        try {
            const response = await fetchWithCredentials(
                server(`auth/resetPassword/${token}`),
                {
                    body: JSON.stringify(params),
                    credentials: "include",
                    method: "POST",
                }
            );

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
