import AgoraRTM from "agora-rtm";
import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerGeofencing = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
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
