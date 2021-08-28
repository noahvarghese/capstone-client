import { AuthState, DefaultAuthState } from "./auth";

export interface State {
    auth: AuthState;
}

const DefaultState: State = {
    auth: DefaultAuthState,
};

export default DefaultState;
