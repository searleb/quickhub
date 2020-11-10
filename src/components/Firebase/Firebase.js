import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Header from '../Header';
import FirebaseContext from '../../context/FirebaseContext';

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

  return (
    <FirebaseContext.Provider value={state}>
      <main>
        <Header />

        {state.signedIn ? (
          children
        ) : (
          <div className="flex justify-center mt-48">
            <Button
              onClick={() => sendMessage({ action: 'sign-in' })}
              text="Sign In with GitHub"
            />
          </div>
        )}
      </main>
    </FirebaseContext.Provider>
  );
};

export default Firebase;
