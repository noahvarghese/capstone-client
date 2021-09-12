import { server } from "../lib/permalink";

export const requestResetPassword = async (
    params: unknown
): Promise<true | { message: string }> => {
    const response = await fetch(server + "auth/requestResetPassword", {
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
    params: T
): Promise<{ success: true } | { message: string; field: keyof T }> => {
    const response = await fetch(server + "auth/resetPassword", {
        method: "POST",
        body: JSON.stringify(params),
    });

    if (response.status !== 201) {
        const { message, field } = await response.json();
        return { message, field };
    } else {
        return { success: true };
    }
};
