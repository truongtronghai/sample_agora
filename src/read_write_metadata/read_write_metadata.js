import SignalingManagerMetadata from "./signaling_manager_metadata.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  const showMessage = (message) => {
    const log = document.getElementById("log");
    const newMessage = document.createElement("div");
    newMessage.textContent = message;
    log.insertBefore(newMessage, log.firstChild);
  };

  const handleSignalingEvents = (event, eventArgs) => {

    switch (event) {
      case "message":
        
        break;
      case "presence":
        if (eventArgs.eventType == 'SNAPSHOT') { // local user logged in
          const currentTime = new Date();
          const options = { timeZoneName: 'short' };
          const timeString = currentTime.toLocaleString(undefined, options);
          // Set channel metadata
          setChannelMetadata(config.channelName, 'lastLogin', timeString);
          // Set user metadata
          setUserMetadata(config.uid, 'userBio', 'I want to learn about Agora Signaling');
          // Fill the list of users in the channel
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        } else if (eventArgs.eventType == 'REMOTE_JOIN' ) { 
          // A remote user joined the channel
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        } else if (eventArgs.eventType == 'REMOTE_LEAVE' ) { 
          // A remote user left the channel
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        }
        break;
      case "storage":
        if (eventArgs.storageType == 'CHANNEL') { // channel metadata was updated
          showChannelMetadata(eventArgs.data.metadata);
        } else if (eventArgs.storageType == 'USER') { // user metadata was updated
          showMessage('Metadata event ' + eventArgs.eventType + ', User: ' + eventArgs.publisher);
          showUserMetadata(eventArgs.data.metadata);
        }
        break;
      case "topic":
        
        break;
      case "lock":
        
        break;
      case "status":
        
        break;
      case "TokenPrivilegeWillExpire":
        
        break;
      default:
        console.log("Unknown eventType");
    }
  };

  // Signaling Manager will create the engine for you
  const {
    signalingEngine,
    login,
    logout,
    subscribe,
    unsubscribe,
    sendChannelMessage,
    setUserMetadata,
    getUserMetadata,
    subscribeUserMetadata,
    setChannelMetadata,
    getChannelMetadata,
  } = await SignalingManagerMetadata(showMessage, handleSignalingEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML = config.channelName;
  // Display User name
  document.getElementById("userId").innerHTML = config.uid;

  const ul = document.getElementById("users-list");

  const updateChannelUserList = async function (channelName, channelType) {
    // Retrieve a list of users in the channel
    const result = await signalingEngine.presence.whoNow(channelName, channelType);
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
    const userList = document.getElementById("user-list");
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

  const onUserClick = async function(uid) {
    // Show user metadata
    const metaData = await getUserMetadata(uid);
    showUserMetadata(metaData);
  }
 
  // Display channel name
  document.getElementById("channelName").innerHTML = config.channelName;
  // Display User name
  document.getElementById("userId").innerHTML = config.uid;

  // Login
  document.getElementById("login").onclick = async function () {
    await login();
  };

  // Logout
  document.getElementById("logout").onclick = async function () {
    await logout();
  };

  // Subscribe to a channel
  document.getElementById("subscribe").onclick = async function () {
    subscribe(config.channelName);
  };

  // Unsubscribe a channel
  document.getElementById("unsubscribe").onclick = async function () {
    await unsubscribe(config.channelName);
  };

  // Send a message to the channel
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(config.channelName, channelMessage);
  };

  const showUserMetadata = async function (metaData) {
    // Display a user's metadata in the log
    for (const key in metaData) {
      if (metaData.hasOwnProperty(key)) {
        const metaDataDetail = metaData[key];
        const value = metaDataDetail.value;
        showMessage(key + ': ' + value);
      }
    }
  }

  const showChannelMetadata = async function(metaData) {
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
        const existingItem = existingItems.find(item => item.id === key);
  
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
    existingItems.forEach(item => item.remove());
  };
  
};
