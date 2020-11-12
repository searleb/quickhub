import React from 'react';

const Pill = ({ text }) => (
  <span className="px-1 ml-1 text-xs text-blue-900 lowercase bg-gray-200 border border-gray-300 rounded">
    {text}
  </span>
);

const RepoListItem = ({ repo }) => (
  <li key={repo.id} className="hover:bg-gray-200">
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="flex justify-between w-full px-2 py-1 hover:cursor-pointer"
    >
      <span className="text-blue-900 truncate">
        {repo.name || repo.description}
      </span>
      <div>
        {/* repos */}
        {repo.private === true && <Pill text="private" />}
        {/* gists */}
        {repo.public === false && <Pill text="secret" />}
        {/* both */}
        {repo.archived && <Pill text="archived" />}
      </div>
    </a>
  </li>
);

export default RepoListItem;
