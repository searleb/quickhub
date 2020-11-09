import { useContext } from "react";
import FirebaseContext from "../../context/FirebaseContext";
const Home = () => {
  const firebase = useContext(FirebaseContext);
  console.log("firebase home", firebase);
  return (
    <div>
      <button
        onClick={() => chrome.runtime.sendMessage({ message: "sign-out" })}
      >
        Sign Out
      </button>
      <h1>QuickHub Home</h1>
      {firebase.name}
    </div>
  );
};

export default Home;
