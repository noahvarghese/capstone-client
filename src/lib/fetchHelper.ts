export const fetchWithCredentials = async (
    url: string,
    data: any,
    method: "POST" | "PUT" | "GET" | "DELETE",
    headers?: HeadersInit
) => await fetch(url, { body: data, credentials: "include", headers, method });
