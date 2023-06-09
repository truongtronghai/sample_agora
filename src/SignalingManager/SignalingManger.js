const SignallingManager = async ({ appId, channelName, token }) => {
  let signalingEngine = null;
  let signalingChannel = null;
  const setupSignallingEngine = async () => {
    // Create an Agora RTM instance
    const engine = AgoraRTM.createInstance(appId);

    // Create a channel
    const channel = engine.createChannel(channelName);

    // engine Event listeners
    // Display messages from peer
    engine.on("MessageFromPeer", function (message, peerId) {
      console.log("New message from peerId: ", peerId);
      console.log("Message: ", message);
    });

    // Display connection state changes
    engine.on("ConnectionStateChanged", function (state, reason) {
      console.log("Connection state changed to: ", state);
      console.log("Reason: ", reason);
    });

    // Display channel messages
    channel.on("ChannelMessage", function (message, memberId) {
      console.log("Channel recieved a new message from member: ", memberId);
      console.log("Message: ", message);
    });

    // Display channel member stats
    channel.on("MemberJoined", function (memberId) {
      console.log("New member joined the channel with ID: ", memberId);
    });

    // Display channel member stats
    channel.on("MemberLeft", function (memberId) {
      console.log(memberId, " left the channel...");
    });

    signalingEngine = engine;
    signalingChannel = channel;
  };

  // login using the signalingEngine instance
  const login = async () => {
    try {
      let options = {
        uid: "",
        token: "",
      };

      options.uid = 0;
      options.token = token;
      await signalingEngine.login(options);
    } catch (error) {
      console.error("Failed to login with error: ", error);
    }
  };

  // logout using the signalingEngine instance
  const logout = async () => {
    try {
      await signalingEngine.logout();
    } catch (error) {
      console.error("Failed to logout with error: ", error);
    }
  };

  // Join channel
  const joinChannel = async () => {
    try {
      await signalingChannel.join();
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  };

    // Leave channel
    const leaveChannel = async () => {
      try {
        if (signalingChannel != null) {
          await signalingChannel.leave()
        } else {
          console.log("Channel is empty")
        }
      } catch (error) {
        console.error("Failed to unpublish or leave:", error);
      }
    }

    // Send Message to Peer
    const sendMessageToPeer = async (peerId, peerMessage) => {
      try {
        await signalingEngine.sendMessageToPeer(
            { text: peerMessage },
            peerId,
        ).then(sendResult => {
            return sendResult.hasPeerReceived
        })
      } catch (error) {
        console.log("Error sending message to Peer: ", error)
      }
    }

    // Send message to channel
    const sendMessageToChannel = async (channelMessage) => {
      if (this.channel != null) {
        await this.channel.sendMessage({ text: channelMessage }).then(() => {
          console.log("Message sent successfully")
        }).catch(error => {
          return error
        })
      }
    }

    await setupSignallingEngine();
    return {signalingEngine, signalingChannel}
};

export default SignallingManager;
