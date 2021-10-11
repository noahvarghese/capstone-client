import { fetchWithCredentials } from "../lib/fetchHelper";
import { server } from "../lib/permalink";

export const requestResetPassword = async (params: unknown): Promise<void> => {
    const response = await fetchWithCredentials(
        server("auth/requestResetPassword"),
        { body: JSON.stringify(params), method: "POST" }
    );

    if (response.status !== 200) {
        const { message } = await response.json();
        throw new Error(message);
    }
    return;
};

export const submitNewPassword = async <T>(
    token: string,
    params: T
): Promise<void> => {
    const response = await fetchWithCredentials(
        server(`auth/resetPassword/${token}`),
        {
            body: JSON.stringify(params),
            credentials: "include",
            method: "POST",
        }
    );

    if (response.status === 201) {
        return;
    }

    const { message } = await response.json();
    throw new Error(message);
};
