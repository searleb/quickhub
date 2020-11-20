import { INITIALIZE } from '../actions';
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

  if (!token) {
    return undefined;
  }

  const data = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (data.ok) {
    return data.json();
  }
  // if not authorized, sign user out so they can sign in again.
  if (data.status === 401) {
    signOut();
  }

  return undefined;
}

export async function fetchOrgs() {
  const orgs = await githubFetch(`${githubApi}/user/orgs`);
  storage.local.set({ userOrgs: orgs });
}

export async function fetchUserRepos(page = 1, sendResponse) {
  const profile = await getGithubProfile();
  if (profile) {
    /*
    * This is annoying, the profile api path (profile.repo_url) only returns public repos
    * so we have to use the search endpoint which returns public and private repos?
    */
    const repos = await githubFetch(`${githubApi}/search/repositories?q=user:${profile.login}&sort=updated&page=${page}`);
    sendResponse(repos.items);
    // storage.local.set({ userRepos: repos.items });
  }
}

export async function fetchInitializeData() {
  // Send local storage data back to the front end. (fast)
  storage.local.get(
    ['githubProfile', 'userRepos', 'userOrgs'],
    ({ githubProfile, userRepos, userOrgs }) => {
      sendMessage({
        action: INITIALIZE,
        payload: {
          githubProfile,
          userRepos,
          userOrgs,
        },
      });
    },
  );

  fetchOrgs();
}

export async function fetchGithubUrl(url, sendResponse) {
  const data = await githubFetch(url);
  sendResponse(data);
}

export async function fetchGists(page = 1, sendResponse) {
  const gists = await githubFetch(`${githubApi}/gists?page=${page}`);
  sendResponse(gists);
  setTimeout(() => {
    sendResponse('send time around?');
  }, 500);
}

export async function fetchGithubNotifications(sendResponse) {
  const gists = await githubFetch(`${githubApi}/notifications`);
  sendResponse(gists);
}

let intervalId;
chrome.runtime.onStartup.addListener(() => {
  const updateNotificationBadge = async () => {
    const notifications = await githubFetch(`${githubApi}/notifications`);
    if (Array.isArray(notifications)) {
      chrome.browserAction.setBadgeText({ text: `${notifications.length}` });
    }
  };

  intervalId = setInterval(async () => {
    updateNotificationBadge();
  }, 1000 * 60 * 15);

  updateNotificationBadge();
});

chrome.runtime.onSuspend.addListener(() => {
  clearInterval(intervalId);
});
