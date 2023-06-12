import SignallingManager from "../SignalingManager/SignalingManger.js";

// Signaling Manager will create the engine and channel for you
const { signalingEngine, signalingChannel } = await SignallingManager();

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = function () {
  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    let options = {
      uid: "",
      token: "",
    };
    options.uid = document.getElementById("userID").value.toString();
    options.token = token;
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
        .append(
          "You have successfully joined channel " + signalingChannel.channelId
        );
    });
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    if (signalingChannel != null) {
      await signalingChannel.leave().then(() => {
        document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append(
            "You have successfully left channel " + signalingChannel.channelId
          );
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
            "Channel message: " +
              channelMessage +
              " from " +
              signalingChannel.channelId
          );
      });
    }
  };
};
