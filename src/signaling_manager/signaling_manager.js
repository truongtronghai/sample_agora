const SignalingManager = async (messageCallback) => {
  let signalingEngine = null;
  let signalingChannel = null;
  let uid = "";

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Set the uid to export it
  uid = config.uid;

  // Setup the signaling engine and channel
  const setupSignallingEngine = async () => {
    // Create an Agora RTM instance
    signalingEngine = AgoraRTM.createInstance(config.appId);

    // Create a signalingChannel
    signalingChannel = signalingEngine.createChannel(config.channelName);

    // signalingEngine Event listeners
    // Display messages from peer
    signalingEngine.on("MessageFromPeer", function (message, peerId) {
      messageCallback("Received peer message from " + peerId + ": " + message.text);
    });

    // Display connection state changes
    signalingEngine.on("ConnectionStateChanged", function (state, reason) {
      messageCallback("Connection state changed to: " + state + ", Reason: " + reason);
    });

    // Display signalingChannel messages
    signalingChannel.on("ChannelMessage", function (message, memberId) {
      messageCallback("Received channel message from " + memberId + ": " + message.text);
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberJoined", function (memberId) {
      messageCallback("A member joined the channel with ID: " + memberId);
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberLeft", function (memberId) {
      messageCallback(memberId + " left the channel...");
    });
  };

  await setupSignallingEngine();

  const login = async (uid, token) => {
    const loginParams = {
      uid: uid || config.uid,
      token: token || config.token
    };
    signalingEngine.login(loginParams); 
  };

  const logout = async () => {
    signalingEngine.logout();
  };

  const join = async () => {
    await signalingChannel.join().then(() => {
      messageCallback("You have successfully joined channel " + signalingChannel.channelId);
    });
  };

  const leave = async () => {
    if (signalingChannel != null) {
      await signalingChannel.leave().then(() => {
        messageCallback("You have successfully left channel " + signalingChannel.channelId);
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
          messageCallback("Message received by " + peerId + ": " + peerMessage);
        } else {
          messageCallback("Message sent to: " + peerId + ": " + peerMessage);
        }
      });
  };

  const sendChannelMessage = async () => {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();

    if (signalingChannel != null) {
      await signalingChannel.sendMessage({ text: channelMessage }).then(() => {
        messageCallback("Channel message from " + signalingChannel.channelId + ": " + channelMessage);
      });
    }
  };

  return {
    signalingEngine,
    signalingChannel,
    uid,
    login,
    logout,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage
  };
};

export default SignalingManager;
