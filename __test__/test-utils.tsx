import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";

function render(
    ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
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
            <>
                {history && <Router history={history}>{children}</Router>}
                {!history && <BrowserRouter>{children}</BrowserRouter>}
            </>
        );
    }
    return rtlRender(ui, {
        wrapper: Wrapper as React.ComponentType,
    });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };

export const renderWithRouter = (
    ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    { route = "/" } = {}
) => {
    window.history.pushState({}, "Test page", route);

    return render(ui, { wrapper: BrowserRouter });
};
