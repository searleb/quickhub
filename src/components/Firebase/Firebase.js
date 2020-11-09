import React, { useEffect, useState } from "react";
import FirebaseContext from "../../context/FirebaseContext";

const Firebase = ({ children }) => {
  const [state, setState] = useState({ signedIn: false, user: {} });
  const { sendMessage, onMessage } = chrome.runtime;

  useEffect(() => {
    sendMessage({ action: "is-user-signed-in" });
  }, [sendMessage]);

  onMessage.addListener((message) => {
    if (message.action === "auth-changed") {
      setState({
        signedIn: message.signedIn,
        user: message.user,
      });
    }
  });

  return state.signedIn ? (
    <FirebaseContext.Provider value={state.user}>
      {children}
    </FirebaseContext.Provider>
  ) : (
    <div>
      <button onClick={() => sendMessage({ action: "sign-in" })}>
        Sign In with GitHub
      </button>
    </div>
  );
};

export default Firebase;
