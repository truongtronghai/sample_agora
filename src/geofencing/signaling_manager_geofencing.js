import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerGeofencing = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Set whitelist and blacklist areas
  AgoraRTM.setArea({ areaCodes: ["CHINA", "INDIA"], excludedArea: "JAPAN" });

  // Return the extended signaling manager
  return {
    ...signalingManager,
  };
};

export default SignalingManagerGeofencing;
