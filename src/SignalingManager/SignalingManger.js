const SignallingManager = async ({ appId, channelName, token }) => {
  let signalingEngine = null;
  let signalingChannel = null;

  // Setup the signaling engine and channel
  const setupSignallingEngine = async () => {
    // Create an Agora RTM instance
    signalingEngine = AgoraRTM.createInstance(appId);

    // Create a signalingChannel
    signalingChannel = signalingEngine.createChannel(channelName);

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
  return { signalingEngine, signalingChannel };
};

export default SignallingManager;
