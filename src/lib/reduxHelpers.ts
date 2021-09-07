import { CustomAction } from "../types/customAction";

export const createReducer =
    (initialState: any, handlers: object) =>
    (state: any = initialState, action: CustomAction) =>
        handlers.hasOwnProperty(action.type)
            ? (handlers[action.type as keyof object] as any)(state, action)
            : state;

export const reducerFunction =
    <T>(key: string) =>
    (prevState: T, action: CustomAction) => ({
        ...prevState,
        [key as keyof T]: action.payload,
    });
