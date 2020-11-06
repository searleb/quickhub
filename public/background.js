/* eslint-disable no-undef */

let isAuthed = false
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request.message', request.message);
  switch (request.message) {
    case 'logged-in':
      isAuthed = true;
      break;
    case 'is-logged-in?':
      sendResponse({
        message: 'success',
        payload: isAuthed
      })
      break;
  
    default:
      break;
  }
})