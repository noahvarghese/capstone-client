/**
 *
 * @param t timeout in milliseconds
 */
export const sleep = async (t: number): Promise<void> =>
    await new Promise((res) => setTimeout(res, t));
