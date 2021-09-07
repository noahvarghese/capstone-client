export const checkEnvironmentBeforeAction = (
    dev: boolean,
    prodAction: () => any,
    devAction: () => any
): void => {
    if (
        process.env.NODE_ENV === "test" ||
        (dev && process.env.NODE_ENV === "development")
    ) {
        devAction();
    } else prodAction();
};
