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
import useCheckAuth from "./hooks/useCheckAuthenticated";
import Nav from "./components/Nav";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import Loading from "./components/Loading";
import useNav from "./hooks/useNav";
import Members from "./pages/Members";
import MemberEdit from "./pages/Members/Edit";
import Department from "./pages/Department";
import Role from "./pages/Role";

abstract class AbstractApp extends React.Component<{
    auth: boolean;
    setAuth: (auth: boolean) => void;
}> {
    protected routes?: RouteProps[];

    render() {
        return (
            <Switch>
                {this.routes?.map((route) => {
                    return <Route key={JSON.stringify(route)} {...route} />;
                })}
            </Switch>
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
            { path: "/members", exact: true, component: Members },
            { path: "/departments", exact: true, component: Department },
            { path: "/roles", exact: true, component: Role },
            { path: "/member/:id", exact: true, component: MemberEdit },
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
    const { links } = useNav(authenticated);
    const redirectOnAuthChange = useCallback(
        (auth: boolean) => {
            setAuthenticated(auth);

            if (history.location.pathname !== "/") history.push("");
        },
        [history, setAuthenticated]
    );

    if (loading) {
        return <Loading />;
    } else {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Nav links={links} />
                    {authenticated ? (
                        <LoggedInApp
                            setAuth={redirectOnAuthChange}
                            auth={authenticated}
                        />
                    ) : (
                        <LoggedOutApp
                            setAuth={redirectOnAuthChange}
                            auth={authenticated}
                        />
                    )}
                    <footer></footer>
                </div>
            </ThemeProvider>
        );
    }
};

export default App;
