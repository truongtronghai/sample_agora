import SignalingManager from "../signaling_manager/signaling_manager.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import handleSignalingEvents from "../utils/handleSignalingEvents.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    getSignalingChannel,
    login,
    logout,
    join,
    leave,
    sendChannelMessage,
  } = await SignalingManager(showMessage, handleSignalingEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML = config.channelName;
  // Display User name
  document.getElementById("userId").innerHTML = config.uid;

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login();
  };

  // logout
  document.getElementById("logout").onclick = async function () {
    await logout();
  };

  // join channel
  document.getElementById("join").onclick = async function () {
    await join(config.channelName);
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    await leave(config.channelName);
  };
  
  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(config.channelName, channelMessage);
  };
};
