const SignalingManager = async (messageCallback, eventsCallback, rtmConfig) => {
  let signalingEngine = null;
  let signalingChannel = null;

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Set up the signaling engine with the provided App ID, UID, and configuration
  const setupSignalingEngine = async (rtmConfig) => {
    try {
      rtmConfig = rtmConfig || {
        token: config.rtmConfig.token,
        useStringUserId: config.rtmConfig.useStringUserId,
      };
      AgoraRTM.setArea({ areaCodes: ["ASIA"] });
      signalingEngine = new AgoraRTM.RTM(config.appId, config.uid, rtmConfig);
    } catch (error) {
      console.log("Error:", error);
    }

    // Event listener to handle incoming messages and connection status changes
    signalingEngine.addEventListener({
      // Message event handler
      message: (event) => {
        eventsCallback(event);
        messageCallback(
          "Received peer message from " + event.publisher + ": " + event.message
        );
      },
      // State event handler
      status: (event) => {
        eventsCallback(event);
        messageCallback(
          "Connection state changed to: " +
            event.state +
            ", Reason: " +
            event.reason
        );
      },
      // Presence event handler.
      presence: (event) => {
        eventsCallback(event);
        if (event.eventType === "SNAPSHOT") {
          messageCallback(
            event.snapshot[0].userId + " joined " + event.channelName
          );
        } else {
          messageCallback(event.publisher + " is " + event.eventType);
        }
      },
    });
  };

  await setupSignalingEngine(rtmConfig);

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
    await signalingEngine.logout();
  };

  // Get signaling Channel instance
  const getSignalingChannel = () => {
    return signalingChannel;
  };

  const createChannel = async (channelName) => {
    // Create a signalingChannel
    channelName = channelName || config.channelName;
    try {
      signalingChannel = await signalingEngine.createStreamChannel(channelName);
    } catch (error) {
      console.error(error);
    }

    // Display signalingChannel messages
    signalingChannel.on("ChannelMessage", function (message, memberId) {
      const eventArgs = { message: message, memberId: memberId };
      eventsCallback("ChannelMessage", eventArgs);
      messageCallback(
        "Received channel message from " + memberId + ": " + message.text
      );
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberJoined", function (memberId) {
      const eventArgs = { memberId: memberId };
      eventsCallback("MemberJoined", eventArgs);
      messageCallback(memberId + " joined the channel");
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberLeft", function (memberId) {
      const eventArgs = { memberId: memberId };
      eventsCallback("MemberLeft", eventArgs);
      messageCallback(memberId + " left the channel");
    });
  };

  // Join a channel
  const join = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      if (signalingChannel === null) {
        await createChannel(channelName);
      }

      const subscribeOptions = {
        withMessage: true,
        withPresence: true,
        withMetadata: false,
        withLock: false,
      };
      await signalingEngine.subscribe(channelName, subscribeOptions);
    } catch (error) {
      console.log(error);
    }
  };

  // Leave a channel
  const leave = async (channelName) => {
    try {
      await signalingEngine.unsubscribe(channelName);
      eventsCallback({
        eventType: "LEAVE_CHANNEL",
        channelName: channelName,
        channelType: "MESSAGE",
      });
      messageCallback("You have successfully left channel " + channelName);
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
      messageCallback(config.uid + ": " + publishMessage);
    } catch (error) {
      console.log(error);
    }
  };

  // Return the signaling engine and the available functions
  return {
    signalingEngine,
    getSignalingChannel,
    login,
    logout,
    createChannel,
    join,
    leave,
    sendChannelMessage,
  };
};

export default SignalingManager;
