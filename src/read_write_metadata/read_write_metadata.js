import SignalingManagerMetadata from "./SignalingManagerMetadata.js";
import SignalingManager from "./SignalingManagerMetadata.js";

var isUserBusy = false; // track user status
const ul = document.getElementById("members-list");

const showMessage = (message) => {
  document
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append(message);
};

const updateChannelMemberList = async function () {
  // Retrieve a list of users in the channel
  showMessage("1");
  members = await SignalingManager.signalingChannel.getMembers();
  showMessage("2");
  showMessage(members.length);
  for (i = 0; i < members.length; i++) {
    updateUserInList(member[i], false);
  }
};

const removeUserFromList = function (userID) {
  var member = ul.getElementById(userID);
  ul.removeChild(member);
}

const updateUserInList = async function (userID, busy) {
  let doesUserExist = false; // check if userID is in members list
  let userData = ""; // User data, `user ID: Busy` or `User ID: Available`
  let member;
  //var ul = document.getElementById("members-list");
  var members = ul.getElementsByTagName("li");

  for (var i = 0; i < members.length; i++) {
    if (members[i].innerHTML.includes(userID)) {
      userData = members[i].innerHTML;
      member = members[i];
      doesUserExist = true;
      break;
    }
  }

  if (doesUserExist) {
    // User already in the list, update the status
    // switch the status if needed
    if (busy && userData.includes("Available")) {
      member.innerHTML = userData.replace("Available", "Busy");
    }
    if (!busy && userData.includes("Busy")) {
      member.innerHTML = userData.replace("Busy", "Available");
    }
  } else {
    // Add a new user to the list
    // Create a li item
    const li = document.createElement("li");
    li.setAttribute("id", userID);
    li.textContent = userID + ": " + (busy ? "Busy" : "Available");
    showMessage(userID);
    ul.appendChild(li);

    // Subscribe to metadata change event for the user
    await SignalingManager.signalingEngine.subscribeUserMetadata(userID);
  }
};

const handleSignalingEvents = (eventName, eventArgs) => {
  
  if (eventName == "MessageFromPeer") {
    
  } else if (eventName == "ConnectionStateChanged") {
    
  } else if (eventName == "ChannelMessage") {
    
  } else if (eventName == "MemberJoined") {
    updateChannelMemberList();
    showMessage("User joined");
  } else if (eventName == "MemberLeft") {
    //removeUserFromList(eventArgs.memberId);
    showMessage("user left")
  } else if (eventName == "UserMetaDataUpdated" ) {
    messageCallback("value:" + rtmMetadata.items[2].getValue());
    value = rtmMetadata.items[2].getValue();
    updateUserInList(eventArgs.uid, value == "busy");
  }
};

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
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
  } = await SignalingManager(showMessage, handleSignalingEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML = signalingChannel.channelId;
  // Display User name
  document.getElementById("userId").innerHTML = uid;

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login();
    await setLocalUserMetadata();
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
