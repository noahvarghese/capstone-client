import { createReducer } from "../../lib/reduxHelpers";
import { CustomAction } from "../../types/customAction";
import { DefaultAuthState } from "../../types/state/auth";

export const setAuthentication = (_: any, action: CustomAction) =>
    action.payload;

export const setAuthorization = (_: any, action: CustomAction) =>
    action.payload;

const authReducer = createReducer(DefaultAuthState, {
    SET_AUTHENTICATION: setAuthentication,
    SET_AUTHORIZATION: setAuthorization,
});

export default authReducer;
