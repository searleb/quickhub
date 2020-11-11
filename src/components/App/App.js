import React from 'react';
import Home from '../Home';
import AppContextProvider from '../../context/AppContext';
import SignIn from '../SignIn';
import Header from '../Header';

function App() {
  return (
    <div style={{ height: '600px', width: '360px' }} className="py-2 overflow-auto text-sm bg-white">
      <AppContextProvider>
        <Header />
        <SignIn>
          <Home />
        </SignIn>
      </AppContextProvider>
    </div>
  );
}

export default App;
