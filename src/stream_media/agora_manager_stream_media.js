import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManagerStreamMedia = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  const streamMedia = async () => {
    // Create an audio track from a source file
    const track = await AgoraRTC.createBufferSourceAudioTrack({
      source: "./sample.mp3",
    });
    // Play the track
    track.startProcessAudioBuffer({ loop: false });
    track.play();
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
    streamMedia,
  };
};

export default AgoraManagerStreamMedia;
