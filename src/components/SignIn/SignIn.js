import React, { useEffect } from 'react';
import Button from '../Button';
import { useAppContext } from '../../context/AppContext';

const SignIn = ({ children }) => {
  const { signedIn } = useAppContext();

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'is-user-signed-in' });
  }, []);

  return (
    <main>
      {signedIn ? (
        children
      ) : (
        <div className="flex justify-center mt-48">
          <Button
            onClick={() => chrome.runtime.sendMessage({ action: 'sign-in' })}
            text="Sign In with GitHub"
          />
        </div>
      )}
    </main>
  );
};

export default SignIn;
