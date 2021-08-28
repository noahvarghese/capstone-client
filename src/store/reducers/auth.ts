import { createReducer } from "../../lib/reduxHelpers";
import { CustomAction } from "../../types/customAction";

export const setAuth = (_: any, action: CustomAction) => action.payload;

const authReducer = createReducer(false, { SET_AUTH: setAuth });

export default authReducer;
