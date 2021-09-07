import React from "react";

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

export const setState =
    <T>(setStateFn: React.Dispatch<React.SetStateAction<T>>, prevState: T) =>
    (name: keyof T) =>
    (newVal: any) => {
        setStateFn({ ...prevState, [name]: newVal });
    };
