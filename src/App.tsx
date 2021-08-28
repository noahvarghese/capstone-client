import React from "react";
import "./App.css";
import { AppRouter } from "@noahvarghese/react-components";
import { connect } from "react-redux";
import { State } from "./types/state";

const App: React.FC = () => {
    return (
        <AppRouter
            navProps={{
                logo: process.env.PUBLIC_URL + "/logo.png",
                items: [],
                type: "card",
            }}
            footerProps={{ copyright: "Noah Varghese 2021" }}
            routes={[]}
        ></AppRouter>
    );
};

export default connect(({ auth }: State) => ({
    auth,
}))(App);
