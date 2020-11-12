import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FETCH_NOTIFICATIONS } from '../../actions';

const Header = () => {
  const { user: { name, photo }, signedIn, githubProfile } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (signedIn) {
      chrome.runtime.sendMessage({ action: FETCH_NOTIFICATIONS }, (res) => {
        setNotifications(res);
        chrome.browserAction.setBadgeText({ text: `${res.length}` });
      });
    }
  }, [signedIn]);

  return (
    <section className="fixed top-0 flex items-center justify-between w-full p-2 bg-white border-b-2">
      <a href={githubProfile.html_url} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
        <img src={photo} alt={name} className="w-8 rounded-full" />
      </a>
      <h1 className="text-base">QuickHub</h1>
      <a href="http://github.com/notifications" target="_blank" rel="noopener noreferrer">
        <span className="block w-4 h-4 text-xs text-center text-white bg-blue-500 rounded">
          {notifications.length}
        </span>
      </a>
    </section>
  );
};

export default Header;
