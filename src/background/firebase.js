import firebase from 'firebase/app';
import 'firebase/auth';
import { AUTH_CHANGED } from '../actions';
import firebaseConfig from './firebaseConfig';

const { sendMessage } = chrome.runtime;
const { storage } = chrome;

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GithubAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});
provider.addScope('repo');
provider.addScope('gist');
provider.addScope('read:org');
provider.addScope('read:user');
provider.addScope('notifications');

export function signIn() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      storage.local.set({
        githubProfile: result.additionalUserInfo.profile,
        githubToken: result.credential.accessToken,
      });
    })
    .catch((error) => {
      console.log('error', error);
    });
}

export function signOut() {
  firebase.auth().signOut().then(() => {
    console.log('logged out');
    chrome.storage.local.clear();
  }).catch((error) => {
    console.error(error);
  });
}

// Only firebase user data available here.
function sendUserStateChange(signedIn, user) {
  let payload = {
    action: AUTH_CHANGED,
    signedIn,
    user: {},
  };
  if (user) {
    payload = {
      ...payload,
      user: {
        name: user.displayName,
        photo: user.photoURL,
      },
    };
  }
  sendMessage(payload);
}

export function isUserSignedIn() {
  const user = firebase.auth().currentUser;
  if (user) {
    sendUserStateChange(true, user);
  } else {
    sendUserStateChange(false);
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    sendUserStateChange(true, user);
  } else {
    sendUserStateChange(false);
  }
});
