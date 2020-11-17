import {
  FETCH_GISTS,
  FETCH_GITHUB,
  FETCH_NOTIFICATIONS,
  INITIALIZE, IS_USER_SIGNED_IN, SIGN_IN, SIGN_OUT,
} from '../actions';
import { isUserSignedIn, signOut, signIn } from './firebase';
import {
  fetchInitializeData, fetchGithubUrl, fetchGists, fetchGithubNotifications,
} from './github';

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

onMessage.addListener((message, sender, sendResponse) => {
  // console.log('message.action', message.action);
  switch (message.action) {
    case IS_USER_SIGNED_IN:
      isUserSignedIn();
      break;
    case SIGN_OUT:
      signOut();
      break;
    case SIGN_IN:
      signIn();
      break;
    case INITIALIZE:
      fetchInitializeData();
      break;
    case FETCH_GITHUB:
      fetchGithubUrl(message.url, sendResponse);
      return true;
    case FETCH_GISTS:
      fetchGists(sendResponse);
      return true;
    case FETCH_NOTIFICATIONS:
      fetchGithubNotifications(sendResponse);
      return true;
    default:
      console.log(`unknown action: ${message.action}`);
      break;
  }
  return undefined;
});
