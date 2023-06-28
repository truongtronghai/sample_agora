import SignalingManagerCloudProxy from "./signaling_manager_cloud_proxy.js";
import showMessage from '../utils/showMessage.js';
import handleSignalingEvents from "../utils/handleSignalingEvents.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";

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
    _signalingEngine,
    _getSignalingChannel,
    login,
    logout,
    join,
    leave,
    sendChannelMessage,
  } = await SignalingManagerCloudProxy(showMessage, handleSignalingEvents);

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
    await join();
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    await leave();
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
      await sendChannelMessage(config.channelName, channelMessage);
    };
};
