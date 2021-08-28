import React from "react";
import "./App.css";
import { AppRouter } from "@noahvarghese/react-components";
import items from "";
import { connect } from "react-redux";

const App = () => {
    return (
        <AppRouter
            navProps={{ logo: "/logo.png", items, type: "card" }}
            footerProps={{ copyright: "Noah Varghese 2021" }}
            routes={[]}
        ></AppRouter>
    );
};

export default connect(({}) => ())(App);
