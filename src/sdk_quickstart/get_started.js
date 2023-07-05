import SignalingManagerGetStarted from "./signaling_manager_get_started.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  const handleSignalingEvents = (event, eventArgs) => {
    switch (event) {
      case "message":
        break;
      case "presence":
        switch (eventArgs.eventType) {
          case "SNAPSHOT":
          case "REMOTE_JOIN":
          case "REMOTE_LEAVE":
            updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
            break;
        }
        break;
    }
  };

  // Signaling Manager will create the engine and channel for you
  const {
    getSignalingEngine,
    config,
    login,
    logout,
    subscribe,
    unsubscribe,
    sendChannelMessage,
  } = await SignalingManagerGetStarted(showMessage, handleSignalingEvents);

  const ul = document.getElementById("members-list");

  const updateChannelUserList = async function (channelName, channelType) {
    // Retrieve a list of users in the channel
    const result = await getSignalingEngine().presence.whoNow(
      channelName,
      channelType
    );
    const users = result.occupants;

    // Create a Set to store the existing userIds
    const existingUsers = new Set();

    // Update the list with online users
    for (let i = 0; i < users.length; i++) {
      const userId = users[i].userId;
      updateUserInList(userId);
      existingUsers.add(userId);
    }

    // Remove offline users from the list
    const userList = document.getElementById("users-list");
    const allUsers = userList.querySelectorAll("li");
    if (allUsers == null) return;
    allUsers.forEach((user) => {
      const userId = user.getAttribute("id");
      if (!existingUsers.has(userId)) {
        user.remove();
      }
    });
  };

  const updateUserInList = async function (userId) {
    const user = document.getElementById(userId);

    if (user == null) {
      // User does not exist in the list, add a new list item
      const li = document.createElement("li");
      li.setAttribute("id", userId);
      li.innerHTML = userId;
      const userList = document.getElementById("users-list");
      userList.appendChild(li);
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

  // Subscribe to a channel
  document.getElementById("subscribe").onclick = async function () {
    await subscribe(config.channelName);
  };

  // Unsubscribe a channel
  document.getElementById("unsubscribe").onclick = async function () {
    await unsubscribe(config.channelName);
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(config.channelName, channelMessage);
  };
};
