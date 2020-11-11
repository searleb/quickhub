import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const Home = () => {
  const { userRepos, githubProfile } = useAppContext();

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'fetch-repos' });
    chrome.runtime.sendMessage({ action: 'fetch-profile' });
  }, []);

  return (
    <div>
      <section className="p-2">
        <a href={`https://gist.github.com/${githubProfile.login}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Gists
        </a>
      </section>
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
