import React from "react";
import "./App.css";
import { AppRouter } from "@noahvarghese/react-components";
import { connect } from "react-redux";
import { State } from "./types/state";
import { AuthState } from "./types/state/auth";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

const App: React.FC<{ auth: AuthState }> = ({ auth }) => {
    let items: { name: string; path: string }[] = [];

    let routes: {
        path?: string;
        component?:
            | React.ComponentType<any>
            | React.ComponentType<
                  RouteComponentProps<any, StaticContext, unknown>
              >
            | undefined;
        exact?: boolean | undefined;
        protectedProps?: {
            condition: () => boolean;
            redirectPath: string;
        };
    }[] = auth.authentication
        ? [
              { path: "/", exact: true, component: Home },
              { path: "*", component: NotFound },
          ]
        : [
              { path: "/", component: Login, exact: true },
              {
                  path: "/forgotPassword",
                  component: ForgotPassword,
                  exact: true,
              },
              {
                  path: "/resetPassword/:token",
                  component: ResetPassword,
                  exact: true,
              },
              { path: "*", component: NotFound },
          ];

    if (auth.authentication) {
        items = [
            {
                name: "handbooks",
                path: "/handbooks",
            },
            {
                name: "quizzes",
                path: "/quizzes",
            },
            {
                name: "scores",
                path: "/scores",
            },
        ];

        // make call to server to return boolean whether user is authorized
        if (true) {
            items.concat([
                { name: "employees", path: "/employees" },
                { name: "roles", path: "/roles" },
                { name: "departments", path: "/departments" },
                { name: "reports", path: "/reports" },
            ]);
        }

        items.push({ name: "logout", path: "/logout" });
    }

    return (
        <AppRouter
            navProps={{
                logo: process.env.PUBLIC_URL + "/logo.png",
                items: items,
                type: "card",
            }}
            footerProps={{ copyright: "Noah Varghese 2021" }}
            routes={routes}
        ></AppRouter>
    );
};

export default connect(({ auth }: State) => ({
    auth,
}))(App);
