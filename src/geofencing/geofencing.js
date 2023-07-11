import showMessage from "../utils/showMessage.js";
import handleSignalingEvents from "../utils/handleSignalingEvents.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import SignalingManagerGeofencing from "./signaling_manager_geofencing.js";
import docURLs from "../utils/docSteURLs.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  // Signaling Manager will create the engine and channel for you
  const { config, login, logout, subscribe, unsubscribe, sendChannelMessage } =
    await SignalingManagerGeofencing(showMessage, handleSignalingEvents);

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
    await subscribe(config.channelName);
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    await unsubscribe(config.channelName);
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(config.channelName, channelMessage);
  };

  // Go to the relevant documentation page on docs.agora.io
  document.getElementById("fullDoc").onclick = async function () {
    window.open(docURLs["geofencing"], "_blank").focus();
  };
};
