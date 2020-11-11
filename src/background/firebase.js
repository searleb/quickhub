import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const { sendMessage } = chrome.runtime;
const { storage } = chrome;

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GithubAuthProvider();

provider.addScope('repo');
provider.addScope('read:org');
provider.addScope('read:user');
provider.addScope('notifications');

// Only firebase user data available here.
function sendUserStateChange(signedIn, user) {
  let payload = {
    action: 'auth-changed',
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
  firebase.auth().signOut();
  chrome.storage.local.clear();
}

export function isUserSignedIn() {
  const user = firebase.auth().currentUser;
  // console.log('current user? ', user);
  if (user) {
    sendUserStateChange(true, user);
  } else {
    sendUserStateChange(false);
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log('user changed', user);
    sendUserStateChange(true, user);
  } else {
    console.log('user changed no user: ', user);
    sendUserStateChange(false);
  }
});
