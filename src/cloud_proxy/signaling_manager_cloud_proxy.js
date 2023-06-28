import { RtmStatusCode } from "agora-rtm-sdk";
import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerCloudProxy = async (messageCallback, eventsCallback) => {
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Set cloud proxy
  const rtmConfig = {
    token: config.token,
    logLevel: "debug",
    useStringUserId: false,
    cloudProxy: true,
  };

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback,
    rtmConfig
  );

  // Return the extended signaling manager
  return {
    ...signalingManager,
  };
};

export default SignalingManagerCloudProxy;
