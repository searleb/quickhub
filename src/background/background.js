import { isUserSignedIn, signOut, signIn } from './firebase';
import { fetchOrgs, fetchProfile, fetchRepos } from './github';

const { onMessage, sendMessage } = chrome.runtime;
const { storage } = chrome;

/**
 * If any data has changed between localstorage and
 * a fetch request, broadcast it to the frontend.
 */
storage.onChanged.addListener((changes) => {
  console.log('changes', changes);
  Object.keys(changes).forEach((key) => {
    sendMessage({
      action: `storage-${key}`,
      payload: changes[key].newValue,
    });
  });
});

onMessage.addListener((message) => {
  console.log('message.action', message.action);
  switch (message.action) {
    case 'is-user-signed-in':
      isUserSignedIn();
      break;
    case 'sign-out':
      signOut();
      break;
    case 'sign-in':
      signIn();
      break;
    case 'fetch-orgs':
      fetchOrgs();
      break;
    case 'fetch-repos':
      fetchRepos();
      break;
    case 'fetch-profile':
      fetchProfile();
      break;
    default:
      break;
  }
});
