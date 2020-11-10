import React, { useContext } from 'react';
import cn from 'classnames';
import FirebaseContext from '../../context/FirebaseContext';
import Button from '../Button';

const Header = () => {
  const { user: { name, photo }, signedIn } = useContext(FirebaseContext);
  return (
    <section className="flex justify-between px-2 pb-2 mb-8 border-b-2">
      <h1 className={cn('transition-all duration-200 transform', {
        'text-4xl': !signedIn,
        'text-lg': signedIn,
      })}
      >
        QuickHub
      </h1>
      <img src={photo} alt={name} className="w-8 rounded-full" />
      {signedIn && (
        <Button
          small
          onClick={() => chrome.runtime.sendMessage({ action: 'sign-out' })}
          text="Sign Out"
        />
      )}
    </section>
  );
};

export default Header;
