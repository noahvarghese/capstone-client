import { combineReducers } from "redux";
import { State } from "../../types/state";
import authReducer from "./auth";

export const reducer = combineReducers<State>({
    auth: authReducer,
});
