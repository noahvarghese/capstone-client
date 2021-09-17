export const fetchWithCredentials = async (
    url: string,
    init?: RequestInit | undefined
) => await fetch(url, { ...init, credentials: "include" });
