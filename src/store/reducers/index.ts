import { combineReducers } from "redux";
import { State } from "../../types/state";
import authReducer from "./auth";

const reducer = combineReducers<State>({
    auth: authReducer,
});

export default reducer;
