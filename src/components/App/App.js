import React from 'react';
import Home from '../Home';
import AppContextProvider from '../../context/AppContext';
import SignIn from '../SignIn';
import Header from '../Header';
import Button from '../Button';
import { SIGN_OUT } from '../../actions';

function App() {
  return (
    <div style={{ minHeight: '600px', width: '360px' }} className="text-sm">
      <AppContextProvider>
        <SignIn>
          <Header />
          <Home />
          <section className="fixed bottom-0 flex items-center justify-between w-full px-2 mt-2 bg-white border-t">
            <a href="https://github.com/searleb/quickhub/issues" target="_blank" rel="noopener noreferrer" className="flex items-center text-xs">
              <span className="mr-1 text-2xl">🦥</span>
              GitHub Issues
            </a>
            <Button
              small
              onClick={() => chrome.runtime.sendMessage({ action: SIGN_OUT })}
              text="Sign Out"
            />
          </section>
        </SignIn>
      </AppContextProvider>
    </div>
  );
}

export default App;
