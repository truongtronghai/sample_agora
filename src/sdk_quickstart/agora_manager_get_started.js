import AgoraRTCManager from "../agora_manager/agora_manager.js";

const AgoraRTCGetStarted = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraRTCManager(eventsCallback);

  // Return the extended agora manager
  return {
    ...agoraManager,
  };
};

export default AgoraRTCGetStarted;
