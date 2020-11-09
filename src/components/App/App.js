import React from "react";
import Home from "../Home";
import Firebase from "../Firebase";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Firebase>
        <Home />
      </Firebase>
    </div>
  );
}

export default App;
