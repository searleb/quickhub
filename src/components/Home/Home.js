import React, { useEffect, useState } from 'react';
import { FETCH_GISTS, FETCH_GITHUB, INITIALIZE } from '../../actions';
import { useAppContext } from '../../context/AppContext';
import RepoListItem from '../RepoListItem';
import Tabs from '../Tabs/Tabs';

const OrgRepo = ({ org, gist }) => {
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    if (org) {
      chrome.runtime.sendMessage({ action: FETCH_GITHUB, url: org.repos_url }, ((res) => {
        setRepos(res);
      }));
    }
    if (gist) {
      chrome.runtime.sendMessage({ action: FETCH_GISTS }, ((res) => {
        setRepos(res);
      }));
    }
  }, [gist, org]);

  return (
    <ul className="list-none">
      {repos.map((repo) => <RepoListItem key={repo.id} repo={repo} />)}
    </ul>
  );
};

const Home = () => {
  const { userRepos, githubProfile, userOrgs } = useAppContext();

  useEffect(() => {
    chrome.runtime.sendMessage({ action: INITIALIZE });
  }, []);

  return (
    <section className="pt-12 pb-10">
      <Tabs
        buttons={[
          githubProfile.login,
          'gists',
          ...userOrgs.map((org) => org.login),
        ]}
        panes={[
          <ul>
            {userRepos.map((repo) => <RepoListItem key={repo.id} repo={repo} />)}
          </ul>,
          <OrgRepo gist />,
          ...userOrgs.map((org) => <OrgRepo key={org.id} org={org} />),
        ]}
      />
    </section>
  );
};

export default Home;
