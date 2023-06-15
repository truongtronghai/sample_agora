import SignalingManagerMetadata from "./SignalingManagerMetadata.js";
//import SignalingManager from "./SignalingManagerMetadata.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  const showMessage = (message) => {
    document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append(message);
  };

  const handleSignalingEvents = (eventName, eventArgs) => {
  
    if (eventName == "MessageFromPeer") {
      
    } else if (eventName == "ConnectionStateChanged") {
      if (eventArgs.state == "CONNECTED") {
        setLocalUserMetadata();
      }
    } else if (eventName == "JoinedChannel") {
        updateChannelMemberList();
    } else if (eventName == "LeftChannel") {

    } else if (eventName == "ChannelMessage") {
      
    } else if (eventName == "MemberJoined") {
      updateChannelMemberList();
    } else if (eventName == "MemberLeft") {
      removeUserFromList(eventArgs.memberId);
    } else if (eventName == "UserMetaDataUpdated" ) {
      const item = eventArgs.rtmMetadata.items.find(obj => obj.key === "myStatus");
      if (item !== undefined) {
        const value = item.value;
        updateUserInList(eventArgs.uid, item.value == "busy");
      } 
    }
  };

  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    signalingChannel,
    uid,
    login,
    logout,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage,
    setLocalUserMetadata,
    handleMetadataEvents,
    updateLocalUserMetadata,
  } = await SignalingManagerMetadata(showMessage, handleSignalingEvents);


  var isUserBusy = false; // track user status
  const ul = document.getElementById("members-list");

  const updateChannelMemberList = async function () {
    // Retrieve a list of users in the channel
    const members = await signalingChannel.getMembers();
    for (let i = 0; i < members.length; i++) {
      updateUserInList(members[i], false);
    }
  };

  const removeUserFromList = function (userID) {
    var member = ul.getElementById(userID);
    ul.removeChild(member);
  }

  const updateUserInList = async function (userID, busy) {
    const busyIcon = "&#x1F6AB" ;
    const availableIcon = "&#x2705";
    const member = document.getElementById(userID);

    if (member !== null) {
      // User in list, update user
      member.innerHTML =(busy ? busyIcon : availableIcon) + " " + userID;
    } else {
      // User does not in the list, add a new user
      const li = document.createElement("li");
      li.setAttribute("id", userID);
      li.innerHTML =(busy ? busyIcon : availableIcon) + " " + userID;
      ul.appendChild(li);

      // Subscribe to metadata change event for the user
      await signalingEngine.subscribeUserMetadata(userID);
    }
  };

  // Display channel name
  document.getElementById("channelName").innerHTML = signalingChannel.channelId;
  // Display User name
  document.getElementById("userId").innerHTML = uid;

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login();
    await handleMetadataEvents();
  };

  // logout
  document.getElementById("logout").onclick = async function () {
    await logout();
  };

  // create and join channel
  document.getElementById("join").onclick = async function () {
    await join();
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    await leave();
  };

  // send peer-to-peer message
  document.getElementById("send_peer_message").onclick = async function () {
    await sendPeerMessage();
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    await sendChannelMessage();
  };

  // Change status
  document.getElementById("changeStatus").onclick = async function () {
    isUserBusy = !isUserBusy; // Switch status
    if (isUserBusy) {
      document.getElementById("statusIndicator").innerHTML = "Busy";
    } else {
      document.getElementById("statusIndicator").innerHTML = "Available";
    }

    updateLocalUserMetadata("myStatus", isUserBusy ? "busy" : "available")
    
  };

};
