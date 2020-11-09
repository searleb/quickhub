const { onMessage, sendMessage } = chrome.runtime;
const githubAPI = 'https://api.github.com';

const firebaseConfig = {
  apiKey: "AIzaSyBTNvKao3NH1E6Zjpd9j3aJRDtKlWxb8wE",
  authDomain: "quickhub-ext.firebaseapp.com",
  databaseURL: "https://quickhub-ext.firebaseio.com",
  projectId: "quickhub-ext",
  storageBucket: "quickhub-ext.appspot.com",
  messagingSenderId: "550208721073",
  appId: "1:550208721073:web:883ecc5931316418c2d290",
  measurementId: "G-WBZQNRKY3H",
};

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GithubAuthProvider();

provider.addScope('read:org');
provider.addScope('read:user');
provider.addScope('notifications');

let token = undefined;

const sendUserStateChange = (signedIn, user) => {
  let payload = {
    message: 'auth-changed',
    signedIn,
    user: {}
  }
  if (user) {
    payload = {
      ...payload,
      user: {
        name: user.displayName,
        photo: user.photoURL,
      }      
    }
  }
  sendMessage(payload);
}

function signIn() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
    console.log('result', result);
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    token = result.credential.accessToken;
    // const githubuser = result.additionalUserInfo.profile
    // The signed-in user info.
    // var user = result.user;
    // console.log('token', token);
    // // console.log('user', user);
    // signedInUser = 
    // sendUserStateChange(true, user)
  }).catch(function(error) {
    console.log('error', error);
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('user changed', user);
    sendUserStateChange(true, user)
  } else {
    console.log('user changed no user: ', user);
    sendUserStateChange(false)
  }
});

function isUserSignedIn() {
  const user = firebase.auth().currentUser;
  console.log('current user? ', user);
  if(user) {
    sendUserStateChange(true, user)
  } else {
    sendUserStateChange(false)
  }
}

onMessage.addListener((request, sender, sendResponse) => {
  console.log('request.message', request.message);
  switch (request.message) {
    case 'is-user-signed-in':
      isUserSignedIn()
      break;
    case 'sign-out':
      firebase.auth().signOut();
      break;
    case 'sign-in':
      signIn()
      break;
    default:
      break;
  }
});