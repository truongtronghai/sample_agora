import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerStreamChannel = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  const config = signalingManager.config;

  const streamChannelJoinAndLeave = async function (
    isStreamChannelJoined,
    streamChannelName
  ) {
    if (config.rtcToken === null) {
      console.log(
        "please create a rtc token from the console and add the token to the RtcToken variable in 'src/signaling_manager/config.json'"
      );
      return;
    }
    streamChannel = await signalingManager.getSignalingEngine().createStreamChannel(streamChannelName); // creates stream channel

    if (isStreamChannelJoined === false) {
      await streamChannel
        .join({
          token: config.rtcToken,
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
    if (config.rtcToken === null) {
      console.log(
        "please create a rtc token from the console and add the token to the RtcToken variable in 'src/signaling_manager/config.json'"
      );
      return;
    }

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
