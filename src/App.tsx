import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { FileInput, Button } from "@noahvarghese/react-components";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FileInput name="YOLO" />
        <Button text="HI" />
      </header>
    </div>
  );
}

export default App;
