import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerAuthentication = async (
  messageCallback,
  eventsCallback
) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Get the config
  const config = signalingManager.config;

  // Fetches the Signaling token
  async function fetchToken(uid) {
    if (config.serverUrl !== "") {
      return new Promise(function (resolve) {
        axios
          .get(
            config.proxyUrl +
              config.serverUrl +
              "/rtm/" +
              uid +
              "/?expiry=" +
              config.tokenExpiryTime,
            {
              headers: {
                "X-Requested-With": "XMLHttpRequest",
              },
            }
          )
          .then((response) => {
            resolve(response.data.rtmToken);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      return config.token;
    }
  }

  const fetchTokenAndLogin = async (uid) => {
    const token = await fetchToken(uid);
    signalingManager.login(uid, token);
  };

  const renewToken = async () => {
    const token = await fetchToken();
    const result = await signalingManager
      .getSignalingEngine()
      .renewToken(token);
    messageCallback(result.toString());

    // Event triggers when token is about to expire
    /* signalingManager.signalingEngine.on(
      "TokenPrivilegeWillExpire",
      async function () {
        const token = await fetchToken();
        signalingManager.signalingEngine.renewToken(token);
        console.log("token renewed...");
      }
    ); */
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    renewToken,
    fetchTokenAndLogin,
  };
};

export default SignalingManagerAuthentication;
