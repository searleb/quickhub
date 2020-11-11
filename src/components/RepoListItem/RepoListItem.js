import React from 'react';

const RepoListItem = ({ repo }) => (
  <li key={repo.id} className="hover:bg-gray-200">
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="flex justify-between w-full px-2 py-1 truncate hover:cursor-pointer"
    >
      <span className="text-blue-900">
        {repo.name || repo.description}
      </span>
      {(repo.private || repo.public === false) && (
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
);

export default RepoListItem;
