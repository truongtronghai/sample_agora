import AgoraManager from "../agora_manager/agora_manager.js";

const AgoraManagerCloudProxy = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);
  const agoraEngine = agoraManager.getAgoraEngine();

  // Get the config
  const config = agoraManager.config;

  if (config.cloudProxy == true) {
    // Start cloud proxy service in the forced UDP mode.
    agoraEngine.startProxyServer(3);
    agoraEngine.on("is-using-cloud-proxy", (isUsingProxy) => {
      // Display the proxy server state based on the isUsingProxy Boolean variable.
      if (isUsingProxy == true) {
        console.log("Cloud proxy service activated");
      } else {
        console.log("Proxy service failed");
      }
    });
  }

  const stopProxyServer = () => {
    agoraEngine.stopProxyServer();
  }

  // Return the extended agora manager
  return {
    ...agoraManager,
    stopProxyServer
  };
};

export default AgoraManagerCloudProxy;
