export interface AuthState {
    authorization: number;
    authentication: boolean;
}

export const DefaultAuthState: AuthState = {
    authorization: -1,
    authentication: false,
};
