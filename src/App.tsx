import React, { useCallback } from "react";
import "./App.scss";
import { Route, RouteProps, Switch, useHistory } from "react-router";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Logout from "./components/Logout";
import Register from "./pages/Register";
import useCheckAuth from "./hooks/checkAuthenticated";
import Nav from "./components/Nav";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import Loading from "./components/Loading";

abstract class AbstractApp extends React.Component<{
    auth: boolean;
    setAuth: (auth: boolean) => void;
}> {
    protected routes?: RouteProps[];
    protected navLinks: { name: string; path: string }[] = [];

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Nav auth={this.props.auth} links={this.navLinks} />
                    <Switch>
                        {this.routes?.map((route) => {
                            return (
                                <Route key={JSON.stringify(route)} {...route} />
                            );
                        })}
                    </Switch>
                    <footer></footer>
                </div>
            </ThemeProvider>
        );
    }
}

class LoggedInApp extends AbstractApp {
    constructor(props: {
        auth: boolean;
        setAuth: (
            auth: boolean
        ) => React.Dispatch<React.SetStateAction<boolean>>;
    }) {
        super(props);
        this.routes = [
            { path: "/", exact: true, component: Home },
            {
                path: "/logout",
                exact: true,
                component: () => (
                    <Logout
                        auth={this.props.auth}
                        setAuth={this.props.setAuth}
                    />
                ),
            },
            { path: "*", component: NotFound },
        ];

        this.navLinks = [
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

        // check if authorized
        if (true) {
            this.navLinks.concat([
                { name: "employees", path: "/employees" },
                { name: "roles", path: "/roles" },
                { name: "departments", path: "/departments" },
                { name: "reports", path: "/reports" },
            ]);
        }

        this.navLinks.push({ name: "logout", path: "/logout" });
    }
}

class LoggedOutApp extends AbstractApp {
    constructor(props: {
        auth: boolean;
        setAuth: (
            auth: boolean
        ) => React.Dispatch<React.SetStateAction<boolean>>;
    }) {
        super(props);
        this.routes = [
            {
                path: "/",
                component: () => <Login setAuth={this.props.setAuth} />,
                exact: true,
            },
            {
                path: "/register",
                component: () => <Register setAuth={this.props.setAuth} />,
                exact: true,
            },
            {
                path: "/forgotPassword",
                component: ForgotPassword,
                exact: true,
            },
            {
                path: "/resetPassword/:token",
                component: () => <ResetPassword setAuth={this.props.setAuth} />,
                exact: true,
            },
            { path: "*", component: NotFound },
        ];
    }
}

const App = () => {
    const { authenticated, setAuthenticated, loading } = useCheckAuth();
    const history = useHistory();

    const redirectOnAuthChange = useCallback(
        (auth: boolean) => {
            setAuthenticated(auth);

            if (history.location.pathname !== "/") history.push("/");
        },
        [history, setAuthenticated]
    );

    if (loading) {
        return <Loading />;
    } else if (authenticated) {
        return (
            <LoggedInApp setAuth={redirectOnAuthChange} auth={authenticated} />
        );
    } else {
        return (
            <LoggedOutApp setAuth={redirectOnAuthChange} auth={authenticated} />
        );
    }
};

export default App;
