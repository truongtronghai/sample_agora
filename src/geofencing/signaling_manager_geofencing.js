import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerGeofencing = async (messageCallback, eventsCallback) => {
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Start channel encryption
  const rtmConfig = {
    token: config.token,
    logLevel: "debug",
    useStringUserId: true,
    cloudProxy: true,
  };

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(showMessage, handleSignalingEvents, rtmConfig);

  // Set whitelist and blacklist areas
  AgoraRTM.setArea({ areaCodes: ["CHINA", "INDIA"], excludedArea: "JAPAN" });

  // Return the extended signaling manager
  return {
    ...signalingManager,
  };
};

export default SignalingManagerGeofencing;
