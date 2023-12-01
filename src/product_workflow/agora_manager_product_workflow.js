import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManagerProductWorkflow = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  AgoraRTC.onAutoplayFailed = () => {
    // Create button for the user interaction.
    const btn = document.createElement("button");
    // Set the button text.
    btn.innerText = "Click me to resume the audio/video playback";
    // Remove the button when onClick event occurs.
    btn.onClick = () => {
      btn.remove();
    };
    // Append the button to the UI.
    document.body.append(btn);
  };

  AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
    eventsCallback("microphone-changed", changedDevice)
  };

  AgoraRTC.onCameraChanged = async (changedDevice) => {
    eventsCallback("camera-changed", changedDevice)
  };

  const startScreenShare = async (channelParameters, screenPlayerContainer) => {
    // Create a screen track for screen sharing.
    channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack();
    await agoraManager
      .getAgoraEngine()
      .unpublish([channelParameters.localVideoTrack]);
    channelParameters.localVideoTrack.close();
    // Replace the video track with the screen track.
    await agoraManager
      .getAgoraEngine()
      .publish([channelParameters.screenTrack]);
    // Play the screen track.
    channelParameters.screenTrack.play(screenPlayerContainer);
  };

  const stopScreenShare = async (channelParameters, localPlayerContainer) => {
    // Replace the screen track with the video track.
    await agoraManager
      .getAgoraEngine()
      .unpublish([channelParameters.screenTrack]);
    channelParameters.screenTrack.close();
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await agoraManager
      .getAgoraEngine()
      .publish([channelParameters.localVideoTrack]);
    // Play the video track.
    channelParameters.localVideoTrack.play(localPlayerContainer);
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
    startScreenShare,
    stopScreenShare,
  };
};

export default AgoraManagerProductWorkflow;
