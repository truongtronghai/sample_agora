const SignallingManager = async () => {
  let signalingEngine = null;
  let signalingChannel = null;

  // Get the config from config .json
  const config = await fetch("/SignalingManager/config.json").then((res) =>
    res.json()
  );

  // Setup the signaling engine and channel
  const setupSignallingEngine = async () => {
    // Create an Agora RTM instance
    signalingEngine = AgoraRTM.createInstance(config.appId);

    // Create a signalingChannel
    signalingChannel = signalingEngine.createChannel(config.channelName);

    // signalingEngine Event listeners
    // Display messages from peer
    signalingEngine.on("MessageFromPeer", function (message, peerId) {
      console.log("New message from peerId: ", peerId);
      console.log("Message: ", message);
    });

    // Display connection state changes
    signalingEngine.on("ConnectionStateChanged", function (state, reason) {
      console.log("Connection state changed to: ", state);
      console.log("Reason: ", reason);
    });

    // Display signalingChannel messages
    signalingChannel.on("ChannelMessage", function (message, memberId) {
      console.log("Channel recieved a new message from member: ", memberId);
      console.log("Message: ", message);
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberJoined", function (memberId) {
      console.log("New member joined the channel with ID: ", memberId);
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberLeft", function (memberId) {
      console.log(memberId, " left the channel...");
    });
  };

  await setupSignallingEngine();

  const login = async (uid) => {
    signalingEngine.login({ uid: uid, token: config.token });
  };

  const logout = async () => {
    signalingEngine.logout();
  };

  const join = async () => {
    await signalingChannel.join().then(() => {
      document
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append(
          "You have successfully joined channel " + signalingChannel.channelId
        );
    });
  };

  const leave = async () => {
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

  const sendPeerMessage = async () => {
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

  const sendChannelMessage = async () => {
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
  }

  return {
    signalingEngine,
    signalingChannel,
    login,
    logout,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage
  };
};

export default SignallingManager;
