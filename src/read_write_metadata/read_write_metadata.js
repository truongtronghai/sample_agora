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

  /*const showMessage = (message) => {
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append(message);
  }; */

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
          setUserMetadata(config.uid, 'userBio', 'Agora Signaling implementor');
          // Fill the list of users
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        } else if (eventArgs.eventType == 'REMOTE_JOIN' ) {
          subscribeUserMetadata(eventArgs.publisher);
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        } else if (eventArgs.eventType == 'REMOTE_LEAVE' ) {
          updateChannelUserList(eventArgs.channelName, eventArgs.channelType);
        }
        break;
      case "storage":
        if (eventArgs.storageType == 'CHANNEL') {
          showChannelMetadata(eventArgs.data.metadata);
        } else if (eventArgs.storageType == 'USER') {
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
    getSignalingChannel,
    login,
    logout,
    join,
    leave,
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

  var isUserBusy = false; // track user status
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
    allUsers.forEach((user) => {
      const userId = user.getAttribute("id");
      if (!existingUsers.has(userId)) {
        user.remove();
      }
    });
  };
  
  const updateUserInList = async function (userId, busy) {
    const user = document.getElementById(userId);
  
    if (user !== null) {
      // User in list, update user
      // user.innerHTML = userId;
    } else {
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
    //showMessage('you clicked ' + userId);
    const metaData = await getUserMetadata(uid);
    showUserMetadata(metaData);
  }
 
  const clearChannelUsersList = function () {
    const usersList = document.getElementById("users-list");
    while (usersList.firstChild) {
      usersList.removeChild(usersList.firstChild);
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

  // create and join channel
  document.getElementById("join").onclick = async function () {
    join(config.channelName);
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

  // Change status
  document.getElementById("changeStatus").onclick = async function () {
    isUserBusy = !isUserBusy; // Switch status
    if (isUserBusy) {
      document.getElementById("statusIndicator").innerHTML = "Busy";
    } else {
      document.getElementById("statusIndicator").innerHTML = "Available";
    }

    try {
      setChannelMetadata(config.channelName, "channelDescription", "Friends hangout");
      //updateUserMetadata(config.uid, "myStatus", isUserBusy ? "busy" : "available");
    } catch (status) {
        console.log(status);
    };

    const metaData = await getChannelMetadata(config.channelName, "MESSAGE");
      showChannelMetadata(metaData);
  };

  const showUserMetadata = async function (metaData) {
    //const metaData = await getUserMetadata(uid);
    for (const key in metaData) {
      if (metaData.hasOwnProperty(key)) {
        const metaDataDetail = metaData[key];
        const value = metaDataDetail.value;
        showMessage(key + ': ' + value);
      }
    }
  }

  const showChannelMetadata = async function(metaData) {
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
