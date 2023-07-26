import SignalingManagerStorage from "./signaling_manager_storage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import showMessage from "../utils/showMessage.js";
import docURLs from "../utils/docSteURLs.js";

var uid;
var isLoggedIn = false;

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  const handleSignalingEvents = (event, eventArgs) => {
    switch (event) {
      case "message":
        break;
      case "presence":
        if (eventArgs.eventType == "SNAPSHOT") {
          // The local user logged in
          // Set user metadata
          setUserMetadata(
            config.uid,
            "userBio",
            "I want to learn more about Agora Signaling"
          );
          setUserMetadata(
            config.uid,
            "email",
            `user_${config.uid}@example.com`
          );
          // Fill the list of users in the channel
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        } else if (eventArgs.eventType == "REMOTE_JOIN") {
          // A remote user joined the channel
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        } else if (
          eventArgs.eventType == "REMOTE_LEAVE" ||
          eventArgs.eventType == "REMOTE_TIMEOUT"
        ) {
          // A remote user left the channel
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        }
        break;
      case "storage":
        if (eventArgs.storageType == "CHANNEL") {
          // channel metadata was updated
          showChannelMetadata(eventArgs.data.metadata);
        } else if (eventArgs.storageType == "USER") {
          // user metadata was updated
          showMessage(
            "Metadata event " +
              eventArgs.eventType +
              ", User: " +
              eventArgs.publisher
          );
          //showUserMetadata(eventArgs.publisher, eventArgs.data.metadata);
        }
        break;
      case "topic":
        break;
      case "lock":
        break;
      case "status":
        break;
      case "TokenPrivilegeWillExpire":
        renewToken(uid);
        break;
      default:
        console.log("Unknown eventType: " + event);
    }
  };

  // Signaling Manager will create the engine for you
  const {
    config,
    fetchTokenAndLogin,
    logout,
    subscribe,
    unsubscribe,
    sendChannelMessage,
    setUserMetadata,
    updateUserMetadata,
    getUserMetadata,
    subscribeUserMetadata,
    setChannelMetadata,
    renewToken,
    getOnlineMembersInChannel,
    setLock,
    acquireLock,
  } = await SignalingManagerStorage(showMessage, handleSignalingEvents);

  const ul = document.getElementById("users-list");

  const updateChannelUserList = async function (channelName, channelType) {
    // Retrieve a list of users in the channel
    const users = await getOnlineMembersInChannel(channelName, channelType);

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
    if (allUsers.length === 0) return;
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
      // User does not exist in the list, add a new user
      const li = document.createElement("li");
      li.setAttribute("id", userId);
      li.innerHTML = userId;

      const userList = document.getElementById("users-list");
      userList.appendChild(li);

      // Add click event listener to the list item
      li.addEventListener("click", () => {
        onUserClick(userId);
      });

      // Subscribe to metadata change event for the user
      subscribeUserMetadata(userId);
    }
  };

  const clearChannelUserList = () => {
    const userList = document.getElementById("users-list");
    userList.innerHTML = "";
  };

  const onUserClick = async function (uid) {
    // Call getUserMetadata to retrieve the users data
    const metaData = await getUserMetadata(uid);
    // Show metadata
    showUserMetadata(uid, metaData);
  };

  // Login
  document.getElementById("login").onclick = async function () {
    if (!isLoggedIn) {
      uid = document.getElementById("uid").value.toString();
      if (uid === "") {
        showMessage("Please enter a User ID.");
        return;
      }

      await fetchTokenAndLogin(uid);

      isLoggedIn = true;
      document.getElementById("login").innerHTML = "Logout";
    } else {
      await logout();
      isLoggedIn = false;
      document.getElementById("login").innerHTML = "Login";
    }
  };

  // Subscribe to a channel
  document.getElementById("subscribe").onclick = async function () {
    config.channelName = document
      .getElementById("channelName")
      .value.toString();
    await subscribe(config.channelName);
  };

  // Unsubscribe a channel
  document.getElementById("unsubscribe").onclick = async function () {
    await unsubscribe(config.channelName);
    clearChannelUserList();
  };

  // Update channel metadata
  document.getElementById("update_channel_metadata").onclick =
    async function () {
      const key = document.getElementById("key").value.toString();
      const value = document.getElementById("value").value.toString();
      const revision = parseInt(document.getElementById("revision").value);
      const lockName = document.getElementById("lockName").value.toString();


      await setLock(config.channelName, "MESSAGE", lockName, 15);
      await acquireLock(config.channelName, "MESSAGE", lockName, false);


      setChannelMetadata(config.channelName, key, value, revision, lockName);
    };

  // Update the user bio
  document.getElementById("update_bio").onclick = async function () {
    const bio = document.getElementById("bioText").value.toString();
    updateUserMetadata(config.uid, "userBio", bio);
  };

  // Send a message to the channel
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(config.channelName, channelMessage);
  };

  // Go to the relevant documentation page on docs.agora.io
  document.getElementById("fullDoc").onclick = async function () {
    window.open(docURLs["metadata"], "_blank").focus();
  };

  const showUserMetadata = async function (uid, metaData) {
    // Display a user's metadata in the log
    for (const key in metaData) {
      if (metaData.hasOwnProperty(key)) {
        const metaDataDetail = metaData[key];
        const value = metaDataDetail.value;
        showMessage(`Metadata for user ${uid}: key: ${key}, Value: ${value}`);
      }
    }
  };

  const showChannelMetadata = async function (metaData) {
    // Display the channel metadata
    const dataElement = document.getElementById("channel-metadata");

    // Get all existing metadata items
    const existingItems = Array.from(dataElement.children);

    for (const key in metaData) {
      if (metaData.hasOwnProperty(key)) {
        const metaDataDetail = metaData[key];

        // Access the properties of the MetaDataDetail
        const value = metaDataDetail.value;
        const revision = metaDataDetail.revision;
        const updated = metaDataDetail.updated;
        const authorUid = metaDataDetail.authorUid;

        // Find existing item with the same key
        const existingItem = existingItems.find((item) => item.id === key);

        if (existingItem) {
          // Update existing item
          existingItem.innerHTML = `Key: ${key}, Value: ${value}, Revision: ${revision}, Updated: ${updated}, AuthorUid: ${authorUid}`;

          // Remove the item from the existing items array
          const index = existingItems.indexOf(existingItem);
          existingItems.splice(index, 1);
        } else {
          // Create new item
          const item = document.createElement("div");
          item.setAttribute("id", key);
          item.innerHTML = `Key: ${key}, Value: ${value}, Revision: ${revision}, Updated: ${updated}, AuthorUid: ${authorUid}`;
          dataElement.appendChild(item);
        }
      }
    }

    // Remove any remaining existing items (items that are no longer present in metaData)
    existingItems.forEach((item) => item.remove());
  };
};
