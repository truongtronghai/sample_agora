
const SignalingManager = async (messageCallback) => {
  let signalingEngine = null;

  // Setup the signaling engine with the provided App ID, UID, and configuration
  const setupSignalingEngine = async (appId, uid, rtmConfig) => {
    try {
      signalingEngine = new AgoraRTM.RTM(appId, uid, rtmConfig);
    } catch (error) {
      console.log("Error:", error);
    }

    // Event listener to handle incoming messages and connection status changes
    signalingEngine.addEventListener({
      message: (event) => {
        messageCallback(
          "Received peer message from " +
            event.publisher +
            ": " +
            event.message
        );
      },
      status: (event) => {
        messageCallback(
          "Connection state changed to: " +
            event.status +
            ", Reason: " +
            event.reason
        );
      },
    });
  };

  // Login to the signaling engine
  const login = async () => {
    try {
      const result = await signalingEngine.login();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // Logout from the signaling engine
  const logout = async () => {
    signalingEngine.logout();
  };

  // Join a channel
  const join = async (channelName) => {
    try {
      await signalingEngine.subscribe({ channelName: channelName });
      messageCallback(
        "You have successfully joined channel " + channelName
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Leave a channel
  const leave = async (channelName) => {
    try {
      await signalingEngine.unsubscribe({ channelName: channelName });
      messageCallback(
        "You have successfully left channel " + channelName
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Send a message to a channel
  const sendChannelMessage = async (channelName, Message) => {
    const payload = { type: "text", message: Message };
    const publishMessage = JSON.stringify(payload);
    try {
      const sendResult = await signalingEngine.publish(
        channelName,
        publishMessage
      );
      messageCallback(userId + ": " + publishMessage);
    } catch (error) {
      console.log(error);
    }
  };

  // Return the signaling engine and the available functions
  return {
    signalingEngine,
    login,
    logout,
    join,
    leave,
    sendChannelMessage,
    setupSignalingEngine,
  };
};

export default SignalingManager;
