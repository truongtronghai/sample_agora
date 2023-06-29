import SignalingManagerGetStarted from "./signaling_manager_get_started.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  const handleSignalingEvents = (event) => {
    if (event.eventType == "SNAPSHOT") {
      updateChannelMemberList(event);
    }
  };

  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    getSignalingChannel,
    login,
    logout,
    join,
    leave,
    sendChannelMessage,
  } = await SignalingManagerGetStarted(showMessage, handleSignalingEvents);

  const ul = document.getElementById("members-list");

  const updateChannelMemberList = async function (event) {
    // Retrieve a list of members in the channel
    const result = await signalingEngine.presence.whoNow(event.channelName, event.channelType)
    const members = result.occupants

    for (let i = 0; i < members.length; i++) {
      updateMemberInList(members[i].userId);
    }
  };

  const updateMemberInList = async function (memberId) {
    const member = document.getElementById(memberId);

    if (member !== null) {
      // User in list, do nothing
    } else {
      // User does not in the list, add a new user
      const li = document.createElement("li");
      li.setAttribute("id", memberId);
      li.innerHTML = memberId + "is in the channel";
      ul.appendChild(li);
    }
  };

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
