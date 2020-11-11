import { signOut } from './firebase';

const { sendMessage } = chrome.runtime;
const { storage } = chrome;

const getGithubToken = async () => new Promise((resolve) => {
  storage.local.get(['githubToken'], (res) => {
    resolve(res.githubToken);
  });
});

const getGithubProfile = async () => new Promise((resolve) => {
  storage.local.get(['githubProfile'], (res) => {
    resolve(res.githubProfile);
  });
});

async function githubFetch(url) {
  const token = await getGithubToken();

  const data = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (data.ok) {
    console.log('data.ok', data.ok);
    return data.json();
  }
  // if not authorized, sign user out so they can sign in again.
  if (data.status === 401) {
    signOut();
  }
  console.error('data', data);
  return undefined;
}

export async function fetchOrgs() {
  const data = await githubFetch('/user/orgs');
  console.log('data', data);
}

export async function fetchRepos() {
  const profile = await getGithubProfile();
  // Send local storage data back to the front end. (fast)
  storage.local.get(['userRepos'], (res) => {
    sendMessage({
      action: 'storage-userRepos',
      payload: res?.userRepos,
    });
  });
  // fetch from github and update local storage. (slow)
  if (profile) {
    const data = await githubFetch(
      `https://api.github.com/search/repositories?q=user:${profile.login}&sort=updated`,
    );
    storage.local.set({ userRepos: data.items });
  }
}

export async function fetchProfile() {
  const profile = await getGithubProfile();
  sendMessage({
    action: 'storage-githubProfile',
    payload: profile,
  });
}
