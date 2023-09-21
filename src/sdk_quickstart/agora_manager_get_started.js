import AgoraManager from "../agora_manager/agora_manager.js";

const AgoraGetStarted = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Return the extended agora manager
  return {
    ...agoraManager,
  };
};

export default AgoraGetStarted;
