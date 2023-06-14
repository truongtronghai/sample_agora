import SignalingManager from "../SignalingManager/SignalingManager.js";

const showMessage = (message) => {
  document
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append(message);
};

const handleSignalingEvents = (eventName, eventArgs) => {
  
  if (eventName == "MessageFromPeer") {
    
  } else if (eventName == "ConnectionStateChanged") {
    
  } else if (eventName == "ChannelMessage") {
    
  } else if (eventName == "MemberJoined") {
    
  } else if (eventName == "MemberLeft") {
    
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
  } = await SignalingManager(showMessage, handleSignalingEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML = signalingChannel.channelId;
  // Display User name
  document.getElementById("userId").innerHTML = uid;

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
};
