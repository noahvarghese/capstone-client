import { server } from "../lib/permalink";

export const requestResetPassword = async (
    params: unknown
): Promise<true | { message: string }> => {
    const response = await fetch(server("auth/requestResetPassword"), {
        method: "POST",
        body: JSON.stringify(params),
    });

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
            const response = await fetch(
                server(`auth/resetPassword/${token}`),
                {
                    method: "POST",
                    body: JSON.stringify(params),
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
