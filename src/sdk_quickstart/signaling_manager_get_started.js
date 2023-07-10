import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerGetStarted = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Return the extended signaling manager
  return {
    ...signalingManager,
  };
};

export default SignalingManagerGetStarted;
