import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManagerCustomAudioVideo = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;
  const agoraEngine = agoraManager.getAgoraEngine();

  const startCustomVideoAndAudio = async (channelParameters) => {
    await agoraEngine.join(
      config.appId,
      config.channelName,
      config.token,
      config.uid
    );
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();

    // An object specifying the types of media to request.
    var constraints = (window.constraints = { audio: true, video: true });
    // A method to request media stream object.
    await navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        // Retrieve the available audio tracks.
        var audioTracks = stream.getAudioTracks();
        console.log("Using video device: " + audioTracks[0].label);
        // Create custom audio track.
        channelParameters.localAudioTrack = AgoraRTC.createCustomAudioTrack({
          mediaStreamTrack: audioTracks[0],
        });
        // Get all the available video tracks.
        var videoTracks = stream.getVideoTracks();
        console.log("Using video device: " + videoTracks[0].label);
        // Create a custom video track.
        channelParameters.localVideoTrack = AgoraRTC.createCustomVideoTrack({
          mediaStreamTrack: videoTracks[0],
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Append the local video container to the page body.
    document.body.append(channelParameters.localPlayerContainer);
    // Publish the local audio and video tracks in the channel.
    await agoraEngine.publish([
      channelParameters.localAudioTrack,
      channelParameters.localVideoTrack,
    ]);
    // Play the local video track.
    channelParameters.localVideoTrack.play(
      channelParameters.localPlayerContainer
    );
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
    startCustomVideoAndAudio,
  };
};

export default AgoraManagerCustomAudioVideo;
