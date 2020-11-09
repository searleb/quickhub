const { sendMessage } = chrome.runtime;

function authReducer(state, action) {
  switch (action.type) {
    case "is-user-signed-in":
      return sendMessage(
        { message: "is-user-signed-in" },
        (res) => res.payload
      );
    case "user-signed-in":
      sendMessage({ message: "user-signed-in" });
      return true;
    default:
      throw new Error();
  }
}

export default authReducer;
