import React, { useEffect } from 'react';
import { INITIALIZE } from '../../actions';
import { useAppContext } from '../../context/AppContext';
import Repo from '../OrgRepo/OrgRepo';
import Tabs from '../Tabs/Tabs';

const Home = () => {
  const { githubProfile, userOrgs } = useAppContext();

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
          <Repo key="user" type="user" />,
          <Repo key="gists" type="gists" />,
          ...userOrgs.map((org) => <Repo key={org.id} org={org} type="org" />),
        ]}
      />
    </section>
  );
};

export default Home;
