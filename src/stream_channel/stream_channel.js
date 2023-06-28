import SignalingManagerStreamChannel from "./signaling_manager_stream_channel.js";
import showMessage from "../utils/showMessage.js";
import handleSignalingEvents from "../utils/handleSignalingEvents.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  let isStreamChannelJoined = false;

  // Set the project selector
  setupProjectSelector();

  // Signaling Manager will create the engine and channel for you
  // Signaling Manager will create the engine and channel for you
  const {
    _signalingEngine,
    _getSignalingChannel,
    login,
    logout,
    join,
    leave,
    sendChannelMessage,
    streamChannelJoinAndLeave,
    sendTopicMessage,
  } = await SignalingManagerStreamChannel(showMessage, handleSignalingEvents);

  // Display User name
  document.getElementById("userId").innerHTML = config.uid;
  document.getElementById("streamChannelNameLbl").innerHTML =
    "Stream channel name is: <b>" + streamChannelName + "</b>";

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login();
  };

  // logout
  document.getElementById("logout").onclick = async function () {
    await logout();
  };

  document.getElementById("streamJoinAndLeave").onclick = async function () {
    await streamChannelJoinAndLeave(isStreamChannelJoined); // Join and leave logic

    // UI changes for join and leave
    isStreamChannelJoined = !isStreamChannelJoined;
    if (isStreamChannelJoined) {
      document.getElementById("streamJoinLeave").innerHTML = "Leave";
    } else {
      document.getElementById("streamJoinLeave").innerHTML = "Join";
    }
  };

  document.getElementById("sendTopicMessage").onclick = async function () {
    let message = document.getElementById("topicMessage").textContent;
    let topicName = document.getElementById("topicName").innerHTML;
    sendTopicMessage(message, topicName);
  };
};
