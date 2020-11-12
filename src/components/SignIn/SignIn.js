import React, { useEffect } from 'react';
import Button from '../Button';
import { useAppContext } from '../../context/AppContext';
import { IS_USER_SIGNED_IN, SIGN_IN } from '../../actions';

const SignIn = ({ children }) => {
  const { signedIn } = useAppContext();

  useEffect(() => {
    chrome.runtime.sendMessage({ action: IS_USER_SIGNED_IN });
  }, []);

  return (
    <main>
      {signedIn ? (
        children
      ) : (
        <div className="mt-32 text-center">
          <h2 className="text-6xl">🦥</h2>
          <h1 className="mb-6 text-xl">QuickHub</h1>
          <Button
            onClick={() => chrome.runtime.sendMessage({ action: SIGN_IN })}
            text="Sign In With GitHub"
          />
        </div>
      )}
    </main>
  );
};

export default SignIn;
