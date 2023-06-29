import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerStreamChannel = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  signalingManager.signalingEngine.addEventListener({
    topic: (topicEvent) => {
      // Clear existing options
      dropdown.innerHTML = "";
      // Create and append new options
      messageCallback("Topic Details: " + topicEvent.topicInfos);
      messageCallback(
        "The channel name for which the event was triggered :" +
          topicEvent.channelName
      );
      messageCallback("The publisher is : " + topicEvent.publisher);
      messageCallback(
        "The number of topic in the channel" + topicEvent.totalTopics
      );
    },
    presence: (presenceData) => {
      switch (presenceData.eventType) {
        case "REMOTE_JOIN":
          console.log("A remote user joined the channel");
          console.log(presenceData);
          break;
        case "REMOTE_LEAVE":
          console.log("A remote user left the channel");
          console.log(presenceData);
          break;
        case "REMOTE_TIMEOUT":
          console.log("A remote user connection timeout");
          console.log(presenceData);
          break;
        case "REMOTE_STATE_CHANGED":
          console.log("A remote user connection state changed");
          console.log(presenceData);
          break;
        case "ERROR_OUT_OF_SERVICE":
          console.log("A use joined the channel without presence");
          console.log(presenceData);
          break;
        default:
          // Code to be executed if the expression doesn't match any case
          break;
      }
    },
  });

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
    await signalingManager.join(streamChannelName); // creates stream channel and subscribes to it
    streamChannel = signalingManager.getSignalingChannel();

    if (isStreamChannelJoined === false) {
      await streamChannel
        .join(config.rtcToken, {
          withPresence: true,
        })
        .then((response) => {
          console.log(response);
        });
    } else {
      streamChannel.leave().then((response) => {
        console.log(response);
        showMessage("left channel: " + streamChannelName);
        streamChannel = null;
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
    streamChannel
      .publishTopicMessage(topicName, message, { customType: string })
      .then((response) => {
        console.log(response);
        showMessage("Topic: " + topicName + ",  Message:" + message);
      });
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    streamChannelJoinAndLeave,
    sendTopicMessage,
  };
};

export default SignalingManagerStreamChannel;
