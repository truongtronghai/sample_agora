import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManagerGeofencing = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  // Your app will only connect to Agora SD-RTN located in North America.
  AgoraRTC.setArea({
    areaCode:"ASIA"
  })
  // You can use [] to include more than one region.

  // Return the extended agora manager
  return {
    ...agoraManager,
  };
};

export default AgoraManagerGeofencing;
