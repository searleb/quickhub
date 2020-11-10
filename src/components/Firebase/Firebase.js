import React, { useEffect, useState } from 'react';
import FirebaseContext from '../../context/FirebaseContext';
import Button from '../Button/Button';

const Firebase = ({ children }) => {
  const [state, setState] = useState({ signedIn: false, user: {} });
  const { sendMessage, onMessage } = chrome?.runtime;

  useEffect(() => {
    sendMessage({ action: 'is-user-signed-in' });
  }, [sendMessage]);

  if (onMessage) {
    onMessage.addListener((message) => {
      if (message.action === 'auth-changed') {
        setState({
          signedIn: message.signedIn,
          user: message.user,
        });
      }
    });
  }

  return state.signedIn ? (
    <FirebaseContext.Provider value={state.user}>
      {children}
    </FirebaseContext.Provider>
  ) : (
    <div className="flex items-center justify-center h-full">
      <Button onClick={() => sendMessage({ action: 'sign-in' })}>
        Sign In with GitHub
      </Button>
    </div>
  );
};

export default Firebase;
