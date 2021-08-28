import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./reducers";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

export const store = createStore(reducer, composedEnhancer);

export type RootState = ReturnType<typeof store.getState>;
export const AppDispatch = typeof store.dispatch;
