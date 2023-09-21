import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManagerAuthentication = async (eventsCallback) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  // Fetches the RTC token for stream channels
  async function fetchToken(uid, channelName) {
    if (config.serverUrl !== "") {
      try {
        const res = await fetch(
          config.proxyUrl +
            config.serverUrl +
            "/rtc/" +
            channelName +
            "/" +
            role +
            "/uid/" +
            uid +
            "/?expiry=" +
            config.tokenExpiryTime,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
        const data = await res.text();
        const json = await JSON.parse(data);
        console.log("Video SDK token fetched from server: ", json.rtcToken);
        return json.rtcToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return config.token;
    }
  }

  const joinWithToken = async (localPlayerContainer, channelParameters) => {
    const token = await fetchToken(config.uid, config.channelName);
    await agoraManager
      .getAgoraEngine()
      .join(config.appId, config.channelName, token, config.uid);
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Append the local video container to the page body.
    document.body.append(localPlayerContainer);
    // Publish the local audio and video tracks in the channel.
    await agoraManager
      .getAgoraEngine()
      .publish([
        channelParameters.localAudioTrack,
        channelParameters.localVideoTrack,
      ]);
    // Play the local video track.
    channelParameters.localVideoTrack.play(localPlayerContainer);
  };

  // Renew tokens
  agoraManager
    .getAgoraEngine()
    .on("token-privilege-will-expire", async function () {
      options.token = await fetchToken(config.uid, config.channelName);
      await agoraManager.getAgoraEngine().renewToken(options.token);
    });

  // Return the extended agora manager
  return {
    ...agoraManager,
    joinWithToken,
  };
};

export default AgoraManagerAuthentication;
