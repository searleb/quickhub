import React, { useEffect, useState } from 'react';
import { FETCH_GISTS, FETCH_GITHUB, FETCH_USER_REPOS } from '../../actions';
import Button from '../Button';
import RepoListItem from '../RepoListItem';

const Repo = ({ org, type }) => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleResponse = (res) => {
    setRepos((prev) => [...prev, ...res]);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    if (type === 'org' && org) {
      chrome.runtime.sendMessage({
        action: FETCH_GITHUB,
        url: `${org.repos_url}?sort=updated&page=${page}`,
      }, ((res) => handleResponse(res)
      ));
    }

    if (type !== 'org') {
      const action = type === 'user' ? FETCH_USER_REPOS : FETCH_GISTS;
      chrome.runtime.sendMessage(
        { action, page },
        ((res) => handleResponse(res)),
      );
    }
  }, [org, page, type]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    repos.length > 0 ? (
      <ul className="list-none">
        {repos.map((repo) => <RepoListItem key={repo.id} repo={repo} />)}
        {/* These GitHub endpoints don't return paging data (?)
           so just check if we have complete 30 item pages ¯\_(ツ)_/¯ */}
        {repos.length % 30 === 0 && (
          <div className="flex justify-center p-2">
            <Button
              disabled={loading}
              text={loading ? 'loading...' : 'load more'}
              onClick={handleLoadMore}
            />
          </div>
        )}
      </ul>
    ) : (
      <div className="w-full mt-6 text-xs text-center">
        <span className="block text-xl">
          🦥
        </span>
        Hold on...
      </div>
    )
  );
};

export default Repo;
