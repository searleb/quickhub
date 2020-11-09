const { onMessage, sendMessage } = chrome.runtime;
const { storage } = chrome;

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

provider.addScope('repo');
provider.addScope('read:org');
provider.addScope('read:user');
provider.addScope('notifications');

function sendUserStateChange(signedIn, user) {
  let payload = {
    action: 'auth-changed',
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
    // console.log('result', result);
    storage.local.set({
      githubProfile: result.additionalUserInfo.profile,
      githubToken: result.credential.accessToken
    })
  }).catch(function(error) {
    console.log('error', error);
  });
}

function signOut() {
  firebase.auth().signOut()
  chrome.storage.local.clear()
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log('user changed', user);
    sendUserStateChange(true, user)
  } else {
    console.log('user changed no user: ', user);
    sendUserStateChange(false)
  }
});

function isUserSignedIn() {
  const user = firebase.auth().currentUser;
  // console.log('current user? ', user);
  if(user) {
    sendUserStateChange(true, user)
  } else {
    sendUserStateChange(false)
  }
}

const getGithubToken = async () => new Promise((resolve) => {
  storage.local.get(['githubToken'], (res) => {
    resolve(res.githubToken);
  });
})

const getGithubProfile = async () => new Promise((resolve) => {
  storage.local.get(['githubProfile'], (res) => {
    resolve(res.githubProfile);
  });
})

async function githubFetch(url) {
  const token = await getGithubToken();

  const data = await fetch(url, {
    'headers':{
      Authorization: `token ${token}`
    }
  })
  if (data.ok) {
    console.log('data.ok', data.ok);
    return data.json();
  } else {
    // if not authorized, sign user out so they can sign in again.
    if (data.status === 401) {
      signOut();
    }
    console.error('data', data);
  }
}

async function fetchOrgs(sendResponse) {
  const data = await githubFetch('/user/orgs')
  console.log('data', data);
  sendResponse(data)
}

async function fetchRepos() {
  const profile = await getGithubProfile();
  // Send local storage data back to the front end. (fast)
  storage.local.get(['userRepos'], (res) => {
    sendMessage({ 
      action: `storage-userRepos`,
      payload: res?.userRepos,
    })
  })
  // fetch from github and update local storage. (slow)
  if(profile) {
    const data = await githubFetch(`https://api.github.com/search/repositories?q=user:${profile.login}&sort=updated`);
    storage.local.set({ userRepos: data.items });
  }
}

/**
 * If any data has changed between localstorage and 
 * a fetch request, broadcast it to the frontend.
 */
storage.onChanged.addListener((changes) => {
  console.log('changes', changes);
  for (const key in changes) {
    sendMessage({ 
      action: `storage-${key}`,
      payload: changes[key].newValue,
    })
  }
})

onMessage.addListener((message) => {
  console.log('message.action', message.action);
  switch (message.action) {
    case 'is-user-signed-in':
      isUserSignedIn()
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
    default:
      break;
  }
});