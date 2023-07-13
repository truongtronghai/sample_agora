import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerStreamChannel = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback
  );

  const config = signalingManager.config;

  // Fetches the RTC token for stream channels
  async function fetchRTCToken(uid, channelName) {
    if (config.serverUrl !== "") {
      return new Promise(function (resolve) {
        axios
          .get(
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
          )
          .then((response) => {
            resolve(response.data.rtcToken);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      return config.rtcToken;
    }
  }

  const streamChannelJoinAndLeave = async function (
    isStreamChannelJoined,
    streamChannelName
  ) {
    const token = await fetchRTCToken(config.uid, streamChannelName);
    streamChannel = await signalingManager
      .getSignalingEngine()
      .createStreamChannel(streamChannelName); // creates stream channel

    if (isStreamChannelJoined === false) {
      await streamChannel
        .join({
          token: token,
          withPresence: true,
        })
        .then((response) => {
          console.log(response);
        });
    } else {
      streamChannel.leave().then((response) => {
        console.log(response);
        messageCallback("left channel: " + streamChannelName);
        streamChannel = null;
      });
    }
  };

  const topicJoinAndLeave = async function (isTopicJoined, topicName) {
    if (isTopicJoined === false) {
      await streamChannel.joinTopic(topicName).then((response) => {
        messageCallback("Joined the topic: " + response.topicName);
      });
    } else {
      streamChannel.leaveTopic(topicName).then((response) => {
        console.log(response);
        messageCallback("left topic: " + response.topicName);
      });
    }
  };

  const sendTopicMessage = function (message, topicName) {
    if (message === "" || topicName === "") {
      console.log(
        "Make sure you specified a message and a topic to send messages"
      );
      return;
    }
    streamChannel.publishTopicMessage(topicName, message).then((response) => {
      console.log(response);
      messageCallback("Topic: " + topicName + ",  Message:" + message);
    });
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    streamChannelJoinAndLeave,
    sendTopicMessage,
    topicJoinAndLeave,
  };
};

export default SignalingManagerStreamChannel;
