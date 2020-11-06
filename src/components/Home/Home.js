import React, { useEffect, useState } from 'react'
import firebase from 'firebase';
import * as firebaseui from 'firebaseui'
    
const Home = () => {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState();
  useEffect(() => {
    // eslint-disable-next-line no-undef
    // chrome.runtime.sendMessage('neegjlhfgaekedifdpamjfglgelinhba',{ message: 'is-logged-in?' }, (res => {
    //   console.log('res', res);
    //   if(res.payload) {
    //     setIsLoggedIn(true)
    //   }
    // }))

    const  uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          console.log('authResult', authResult);
          setIsLoggedIn(true)
          setAuth(authResult)
          // eslint-disable-next-line no-undef
          chrome.runtime.sendMessage('neegjlhfgaekedifdpamjfglgelinhba',{ message: 'logged-in' })

          return false;
        },
        uiShown: function() {
          // document.getElementById('loader').style.display = 'none';
        }
      },
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // {
        //   provider: 
        //   customParameters: {
        //     prompt: 'consent'
        //   }
        // }
      ],
      // Terms of service url.
      // tosUrl: '<your-tos-url>',
      // Privacy policy url.
      // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        setIsLoggedIn(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!auth) return
    console.log('auth', auth);
    fetch('https://api.github.com/user', {
      headers:{
        "Authorization": `token ${auth.credential.accessToken}`,
      }
    })
    .then(res => {
      console.log('res', res);
    })
    .catch(err =>{
      console.log('err', err);
    })

  },[auth])

  return (
    <div>
      <h1>QuickHub</h1>
      {isLoggedIn ? 'logged in' : 
      <div id="firebaseui-auth-container"></div>
      }
    </div>
  )
}

export default Home