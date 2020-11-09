import { useEffect, useState } from "react";
import FirebaseContext from "../../context/FirebaseContext";

const Firebase = ({ children }) => {
  const [state, setState] = useState({ signedIn: false, user: {} });
  const { sendMessage, onMessage } = chrome.runtime;

  useEffect(() => {
    sendMessage({ message: "is-user-signed-in" });
  }, [sendMessage]);

  onMessage.addListener((request) => {
    if (request.message === "auth-changed") {
      console.log("request", request);
      setState({
        signedIn: request.signedIn,
        user: request.user,
      });
    }
  });

  console.log("state", state);
  return state.signedIn ? (
    <FirebaseContext.Provider value={state.user}>
      {children}
    </FirebaseContext.Provider>
  ) : (
    <div>
      <button onClick={() => sendMessage({ message: "sign-in" })}>
        Sign In with GitHub
      </button>
    </div>
  );
};

export default Firebase;
