import { signOut } from './firebase';

const githubApi = 'https://api.github.com';

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
  // storage.local.get(['userOrgs'], (res) => {
  //   sendMessage({
  //     action: 'storage-userOrgs',
  //     payload: res?.userOrgs,
  //   });
  // });
  const orgs = await githubFetch(`${githubApi}/user/orgs`);
  storage.local.set({ userOrgs: orgs });
}

export async function fetchRepos() {
  const profile = await getGithubProfile();
  // Send local storage data back to the front end. (fast)
  // storage.local.get(['userRepos'], (res) => {
  //   sendMessage({
  //     action: 'storage-userRepos',
  //     payload: res?.userRepos,
  //   });
  // });
  // fetch from github and update local storage. (slow)
  if (profile) {
    /*
    * This is annoying, the profile api path (profile.repo_url) only returns public repos
    * so we have to use the search endpoint which returns public and private repos?
    */
    const repos = await githubFetch(`${githubApi}/search/repositories?q=user:${profile.login}&sort=updated`);

    storage.local.set({ userRepos: repos.items });
  }
}

// export async function fetchProfile() {
//   const profile = await getGithubProfile();
//   console.log('profile', profile);
//   sendMessage({
//     action: 'storage-githubProfile',
//     payload: profile,
//   });
// }

export async function fetchInitializeData() {
  // Send local storage data back to the front end. (fast)
  storage.local.get(
    ['githubProfile', 'userRepos', 'userOrgs'],
    ({ githubProfile, userRepos, userOrgs }) => {
      sendMessage({
        action: 'initialize',
        payload: {
          githubProfile,
          userRepos,
          userOrgs,
        },
      });
    },
  );

  fetchRepos();
  fetchOrgs();
}

export async function fetchGithubUrl(url, sendResponse) {
  const data = await githubFetch(url);
  sendResponse(data);
  console.log('data', data);
}

export async function fetchGists(sendResponse) {
  const gists = await githubFetch(`${githubApi}/gists?per_page=100`);
  sendResponse(gists);
}
