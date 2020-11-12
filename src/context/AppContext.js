import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { INITIALIZE, AUTH_CHANGED } from '../actions';

const initialState = {
  signedIn: false,
  user: {},
  userRepos: [],
  userOrgs: [],
  githubProfile: {},
};

const AppContext = createContext();

function AppContextProvider({ children }) {
  const [state, setState] = useState(initialState);
  console.log('state: ', state);

  useEffect(() => {
    const reducer = (message) => {
      switch (message.action) {
        case 'storage-githubProfile':
          if (message.payload) {
            setState({
              ...state,
              githubProfile: message.payload,
            });
          }
          break;
        case 'storage-userRepos':
          if (Array.isArray(message.payload)) {
            setState({
              ...state,
              userRepos: message.payload,
            });
          }
          break;
        case 'storage-userOrgs':
          if (Array.isArray(message.payload)) {
            setState({
              ...state,
              userOrgs: message.payload,
            });
          }
          break;
        case AUTH_CHANGED:
          setState({
            ...state,
            signedIn: message.signedIn,
            user: message.user,
          });
          break;
        case INITIALIZE:
          setState({
            ...state,
            ...message.payload,
          });
          break;
        default:
          console.log(`unknown action: ${message.action}`);
      }
    };

    chrome.runtime.onMessage.addListener(reducer);

    return () => chrome.runtime.onMessage.removeListener(reducer);
  }, [state]);

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}

export default AppContextProvider;
