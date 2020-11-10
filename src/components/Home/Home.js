import React, { useEffect, useState } from 'react';

const Home = () => {
  const [userRepos, setUserRepos] = useState([]);

  console.log('userRepos', userRepos);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'fetch-repos' });
  }, []);

  if (chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message) => {
      console.log('message', message);
      if (message.action === 'storage-userRepos') {
        if (Array.isArray(message.payload)) {
          setUserRepos(message.payload);
        }
      }
    });
  }

  return (
    <div>
      <ul>
        {userRepos.map((repo) => (
          <li key={repo.id} className="hover:bg-gray-200">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex justify-between w-full px-2 py-1 truncate hover:cursor-pointer"
            >
              <span className="text-blue-900">
                {repo.name}
              </span>
              {repo.private && (
                <span className="px-1 text-xs text-blue-900 lowercase bg-gray-200 border border-gray-300 rounded">
                  private
                </span>
              )}
              {repo.archived && (
                <span className="px-1 text-xs text-blue-900 lowercase bg-gray-200 border border-gray-300 rounded">
                  archived
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
