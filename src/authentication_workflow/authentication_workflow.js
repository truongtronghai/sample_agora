import SignalingManagerAuthentication from "./signaling_manager_authentication.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import docURLs from "../utils/docSteURLs.js";

var isLoggedIn = false;
var uid;
var channelName;

window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  const handleSignalingEvents = (event, eventArgs) => {
    switch (event) {
      case "TokenPrivilegeWillExpire":
        renewToken(uid);
        break;
    }
  };

  // Signaling Manager will create the engine for you
  const {
    logout,
    subscribe,
    unsubscribe,
    sendChannelMessage,
    renewToken,
    fetchTokenAndLogin,
  } = await SignalingManagerAuthentication(showMessage, handleSignalingEvents);

  // Login with custom UID using token received from token generator
  document.getElementById("login").onclick = async function () {
    if (!isLoggedIn) {
      uid = document.getElementById("uid").value.toString();
      if (uid === "") {
        showMessage("Please enter a User ID.");
        return;
      }

      await fetchTokenAndLogin(uid);

      isLoggedIn = true;
      document.getElementById("login").innerHTML = "LOGOUT";
    } else {
      await logout();
      isLoggedIn = false;
      document.getElementById("login").innerHTML = "LOGIN";
    }
  };

  // join channel
  document.getElementById("join").onclick = async function () {
    channelName = document.getElementById("channelName").value.toString();
    await subscribe(channelName);
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    channelName = document.getElementById("channelName").value.toString();
    await unsubscribe(channelName);
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(channelName, channelMessage);
  };

  // Go to the relevant documentation page on docs.agora.io
  document.getElementById("fullDoc").onclick = async function () {
    window.open(docURLs["authentication"], "_blank").focus();
  };
};
