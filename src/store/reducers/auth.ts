import { createReducer, reducerFunction } from "../../lib/reduxHelpers";
import { AuthState, DefaultAuthState } from "../../types/state/auth";

export const setAuthentication = reducerFunction<AuthState>("authentication");
export const setAuthorization = reducerFunction<AuthState>("authorization");

const authReducer = createReducer(DefaultAuthState, {
    SET_AUTHENTICATION: setAuthentication,
    SET_AUTHORIZATION: setAuthorization,
});

export default authReducer;
