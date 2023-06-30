import SignalingManagerAuthentication from "./signaling_manager_authentication.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";

var isLoggedIn = false;

window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  const handleSignalingEvents = (eventName, _) => {
    if (eventName == "TokenPrivilegeWillExpire") {
      handleTokenExpiry();
    }
  };

  // Signaling Manager will create the engine for you
  const {
    _signalingEngine,
    _getSignalingChannel,
    _login,
    logout,
    join,
    leave,
    sendChannelMessage,
    handleTokenExpiry,
    fetchTokenAndLogin,
  } = await SignalingManagerAuthentication(showMessage, handleSignalingEvents);

  // Login with custom UID using token recieved from token generator
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
    await join(channelName);
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    channelName = document.getElementById("channelName").value.toString();
    await leave(channelName);
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(channelName, channelMessage);
  };
};
