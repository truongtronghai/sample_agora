import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerCloudProxy = async (messageCallback, eventsCallback) => {
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Set cloud proxy
  const rtmConfig = {
    cloudProxy: config.cloudProxy,
  };

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
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
