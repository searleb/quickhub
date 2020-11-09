import Home from "../Home";
import Firebase from "../Firebase";
import "./App.css";

function App() {
  console.log("window.location:", window.location);
  return (
    <div className="App">
      <Firebase>
        <Home />
      </Firebase>
    </div>
  );
}

export default App;
