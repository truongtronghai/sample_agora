import SignallingManager from "../SignalingManager/SignalingManger.js";

// Your app ID
const appId = "17cb7ec4e5d845498de0f75eeac4273a";
// Your token
const token =
  "00617cb7ec4e5d845498de0f75eeac4273aIACpRknChoBQ4Q7PXbEhcInwgp93AMwRyFFbv5sNt/iOzrfv3IMAAAAAEACoRXECYTqEZAEA6APx9oJk";
// Your channel name
const channelName = "demochannel";

const {signalingEngine, signalingChannel} = await SignallingManager({appId, channelName, token});

// Button behavior
window.onload = function () {
  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    let options = {
      uid: "",
      token: "",
    };
    options.uid = document.getElementById("userID").value.toString();
    options.token = token
    await signalingEngine.login(options);
  };

  // logout
  document.getElementById("logout").onclick = async function () {
    await signalingEngine.logout();
  };

  // create and join channel
  document.getElementById("join").onclick = async function () {
    // Channel event listeners
    // Display channel messages
    await signalingChannel.join().then(() => {
      document
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append("You have successfully joined channel " + signalingChannel.channelId);
    });
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    if (signalingChannel != null) {
      await signalingChannel.leave().then(() => {
        document
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append("You have successfully left channel " + signalingChannel.channelId);
      });
    } else {
      console.log("Channel is empty");
    }
  };

  // send peer-to-peer message
  document.getElementById("send_peer_message").onclick = async function () {
    let peerId = document.getElementById("peerId").value.toString();
    let peerMessage = document.getElementById("peerMessage").value.toString();

    await signalingEngine
      .sendMessageToPeer({ text: peerMessage }, peerId)
      .then((sendResult) => {
        if (sendResult.hasPeerReceived) {
          document
            .getElementById("log")
            .appendChild(document.createElement("div"))
            .append(
              "Message has been received by: " +
                peerId +
                " Message: " +
                peerMessage
            );
        } else {
          document
            .getElementById("log")
            .appendChild(document.createElement("div"))
            .append("Message sent to: " + peerId + " Message: " + peerMessage);
        }
      });
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();

    if (signalingChannel != null) {
      await signalingChannel.sendMessage({ text: channelMessage }).then(() => {
        document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append(
            "Channel message: " + channelMessage + " from " + signalingChannel.channelId
          );
      });
    }
  };
};
