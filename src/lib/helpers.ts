import React from "react";

export const setStateFactory =
    <T>(setStateFn: React.Dispatch<React.SetStateAction<T>>, prevState: T) =>
    (name: keyof T) =>
    (newVal: any) => {
        setStateFn({ ...prevState, [name]: newVal });
    };
