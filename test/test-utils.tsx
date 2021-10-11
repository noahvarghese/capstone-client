import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import reducer from "../src/store/reducers";
import { State } from "../src/types/state";
import { store } from "../src/store";

function render(
    ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    {
        preloadedState,
        currentStore = configureStore({
            reducer,
            preloadedState,
        }),
        ...renderOptions
    }: { preloadedState?: State; currentStore?: typeof store } = {},
    history?: any
) {
    function Wrapper({
        children,
    }: {
        children: React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
        >;
    }) {
        return (
            <Provider store={store}>
                {history && <Router history={history}>{children}</Router>}
                {!history && <BrowserRouter>{children}</BrowserRouter>}
            </Provider>
        );
    }
    return rtlRender(ui, {
        wrapper: Wrapper as React.ComponentType,
        ...renderOptions,
    });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
