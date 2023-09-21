import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraCallQuality = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);
  const agoraEngine = agoraManager.getAgoraEngine();

  agoraManager
    .getAgoraEngine()
    .on("connection-state-change", (curState, prevState, reason) => {
      eventsCallback("connection-state-change", curState, prevState, reason);
    });

  // Get the uplink network condition
  agoraEngine.on("network-quality", (quality) => {
    if (quality.uplinkNetworkQuality == 1) {
      document.getElementById("upLinkIndicator").innerHTML = "Excellent";
      document.getElementById("upLinkIndicator").style.color = "green";
    } else if (quality.uplinkNetworkQuality == 2) {
      document.getElementById("upLinkIndicator").innerHTML = "Good";
      document.getElementById("upLinkIndicator").style.color = "yellow";
    } else quality.uplinkNetworkQuality >= 4;
    {
      document.getElementById("upLinkIndicator").innerHTML = "Poor";
      document.getElementById("upLinkIndicator").style.color = "red";
    }
  });

  // Get the downlink network condition
  agoraEngine.on("network-quality", (quality) => {
    if (quality.downlinkNetworkQuality == 1) {
      document.getElementById("downLinkIndicator").innerHTML = "Excellent";
      document.getElementById("downLinkIndicator").style.color = "green";
    } else if (quality.downlinkNetworkQuality == 2) {
      document.getElementById("downLinkIndicator").innerHTML = "Good";
      document.getElementById("downLinkIndicator").style.color = "yellow";
    } else if (quality.downlinkNetworkQuality >= 4) {
      document.getElementById("downLinkIndicator").innerHTML = "Poor";
      document.getElementById("downLinkIndicator").style.color = "red";
    }
  });

  const getDevices = async () => {
    const devices = await AgoraRTC.getDevices();
    const audioDevices = devices.filter(function (device) {
      return device.kind === "audioinput";
    });
    const videoDevices = devices.filter(function (device) {
      return device.kind === "videoinput";
    });
    return {
      audioDevices,
      videoDevices,
    };
  };

  const createTestTracks = async (camera, mic) => {
    const videoTrack = AgoraRTC.createCameraVideoTrack({
      cameraId: camera,
    });
    const audioTrack = AgoraRTC.createMicrophoneAudioTrack({
      microphoneId: mic,
    });
    return {
      videoTrack,
      audioTrack,
    };
  };

  const setRemoteVideoStreamType = (remoteuid, quality) => {
    agoraEngine.setRemoteVideoStreamType(remoteuid, quality);
  };

  const enableDualStreamMode = () => {
    // Enable dual-stream mode.
    agoraEngine.enableDualStream();
  };

  const setAudioProfile = async () => {
    // Create a local audio track and set an audio profile for the local audio track.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "high_quality_stereo",
      });
  };

  const setVideoProfile = async () => {
    // Set a video profile.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      optimizationMode: "detail",
      encoderConfig: {
        width: 640,
        // Specify a value range and an ideal value
        height: { ideal: 480, min: 400, max: 500 },
        frameRate: 15,
        bitrateMin: 600,
        bitrateMax: 1000,
      },
    });
  };

  const getStatistics = async (remoteUid) => {
    const localAudioStats = agoraEngine.getLocalAudioStats();
    const localVideoStats = agoraEngine.getLocalVideoStats();
    let remoteAudioStats;
    let remoteVideoStats;
    if (remoteUid !== undefined) {
      remoteAudioStats = agoraEngine.getRemoteAudioStats()[remoteUid];
      remoteVideoStats = agoraEngine.getRemoteVideoStats()[remoteUid];
    }
    const rtcStats = agoraEngine.getRTCStats();
    return {
      localAudioStats,
      localVideoStats,
      remoteAudioStats,
      remoteVideoStats,
      rtcStats,
    };
  };

  const setStreamFallbackStrategy = async () => {
    // Set a stream fallback option to automatically switch remote video quality when network conditions degrade.
    agoraManager
      .getAgoraEngine()
      .setStreamFallbackOption(channelParameters.remoteUid, 1);
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
    enableDualStreamMode,
    setAudioProfile,
    setVideoProfile,
    setStreamFallbackStrategy,
    getDevices,
    setRemoteVideoStreamType,
    getStatistics,
    createTestTracks,
  };
};

export default AgoraCallQuality;
