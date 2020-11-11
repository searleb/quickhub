import React from 'react';
import cn from 'classnames';
import Button from '../Button';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const { user: { name, photo }, signedIn, githubProfile } = useAppContext();
  return (
    <section className="flex justify-between px-2 pb-2 mb-8 border-b-2">
      <h1 className={cn('transition-all duration-200 transform', {
        'text-4xl': !signedIn,
        'text-lg': signedIn,
      })}
      >
        QuickHub
      </h1>
      <a href={githubProfile.html_url} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
        <img src={photo} alt={name} className="w-8 rounded-full" />
      </a>
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
