import React from "react";

export const checkEnvironmentBeforeAction = async (
    prodAction: () => any | Promise<any>,
    devAction: () => any | Promise<any>
): Promise<void> => {
    if (
        process.env.NODE_ENV === "test" ||
        (process.env.REACT_APP_RUN_DISCONNECTED &&
            process.env.NODE_ENV === "development")
    ) {
        if (devAction instanceof Promise) {
            await devAction();
        } else {
            devAction();
        }
    } else {
        if (prodAction instanceof Promise) {
            await prodAction();
        } else {
            prodAction();
        }
    }
};

export const setStateFactory =
    <T>(setStateFn: React.Dispatch<React.SetStateAction<T>>, prevState: T) =>
    (name: keyof T) =>
    (newVal: any) => {
        setStateFn({ ...prevState, [name]: newVal });
    };
