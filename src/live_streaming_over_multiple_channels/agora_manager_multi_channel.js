import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManagerMultiChannel = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  // A variable to create a second instance of Agora engine.
  var agoraEngineSubscriber;

  const handleChannelMediaRelay = (
    isCoHost,
    destUID,
    destChannelName,
    destChannelToken
  ) => {
    const channelMediaConfig = AgoraRTC.createChannelMediaRelayConfiguration();
    if (!isCoHost) {
      // Set the source channel information.
      // Set channelName as the source channel name. Set uid as the ID of the host whose stream is relayed.
      // The token is generated with the source channel name.
      // Assign the token you generated for the source channel.
      console.log("entering handleChannelMediaRelay");
      channelMediaConfig.setSrcChannelInfo({
        channelName: config.channelName,
        token: config.token,
        uid: config.uid,
      });
      // Set the destination channel information. You can set a maximum of four destination channels.
      // Set channelName as the destination channel name. Set uid as 0 or a 32-bit unsigned integer.
      // To avoid UID conflicts, the uid must be different from any other user IDs in the destination channel.
      // Assign the token you generated for the destination channel.
      channelMediaConfig.addDestChannelInfo({
        channelName: destChannelName,
        token: destChannelToken,
        uid: destUID,
      });
      // Start media relaying.
      agoraManager
        .getAgoraEngine()
        .startChannelMediaRelay(channelMediaConfig)
        .then(() => {
          // Update the button text.
          document.getElementById(`coHost`).innerHTML =
            "Stop Channel Media Relay";
          console.log(`startChannelMediaRelay success`);
        })
        .catch((e) => {
          console.log(`startChannelMediaRelay failed`, e);
        });
      agoraManager
        .getAgoraEngine().on("channel-media-relay-state", state =>
      {
        console.log("The current state is : "+ state);
      });
    } else {
      // Remove a destination channel.
      channelMediaConfig.removeDestChannelInfo(destChannelName);
      // Update the configurations of the media stream relay.
      agoraManager
        .getAgoraEngine()
        .updateChannelMediaRelay(channelMediaConfig)
        .then(() => {
          console.log("updateChannelMediaRelay success");
        })
        .catch((e) => {
          console.log("updateChannelMediaRelay failed", e);
        });
      //Stop the relay.
      agoraManager
        .getAgoraEngine()
        .stopChannelMediaRelay()
        .then(() => {
          console.log("stop media relay success");
        })
        .catch((e) => {
          console.log("stop media relay failed", e);
        });
      // Update the button text.
      document.getElementById(`coHost`).innerHTML = "Start Channel Media Relay";
    }
  };

  const handleMultipleChannels = async (isMultipleChannel, clientRole, secondChannelName, secondChannelToken, channelParameters) => {
    if (isMultipleChannel == false) {
      // Create an Agora engine instance.
      agoraEngineSubscriber = AgoraRTC.createClient({
        mode: "live",
        codec: "vp9",
      });
      // Setup event handlers to subscribe and unsubscribe to the second channel users.
      agoraEngineSubscriber.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event.
        await agoraEngineSubscriber.subscribe(user, mediaType);
        console.log("Subscribe success!");
        if (clientRole == "") {
          // set role to broadcaster
          await agoraEngineSubscriber.setClientRole(ClientRoleType.Broadcaster);
        }
        // You only play the video when you join the channel as a host.
        else if (clientRole == "audience" && mediaType == "video") {
          // Dynamically create a container in the form of a DIV element to play the second channel remote video track.
          const container = document.createElement("div");
          // Set the container size.
          container.style.width = "640px";
          container.style.height = "480px";
          container.style.padding = "15px 5px 5px 5px";
          // Specify the container id and text.
          container.id = user.uid.toString();
          container.textContent =
            "Remote user from the second channel" + user.uid.toString();
          // Append the container to page body.
          document.body.append(container);
          // Play the remote video in the container.
          user.videoTrack.play(container);
        }
        // Listen for the "user-unpublished" event.
        agoraEngineSubscriber.on("user-unpublished", (user) => {
          console.log(user.uid + "has left the channel");
        });
      });
      // Set the user role.
      agoraEngineSubscriber.setClientRole(clientRole);
      // Join the new channel.
      await agoraEngineSubscriber.join(
        config.appId,
        secondChannelName,
        secondChannelToken,
        config.uid
      );
      // An audience can not publish audio and video tracks in the channel.
      if (clientRole != "audience") {
        await agoraEngineSubscriber.publish([
          channelParameters.localAudioTrack,
          channelParameters.localVideoTrack,
        ]);
      }
      isMultipleChannel = true;
      // Update the button text.
      document.getElementById("multiple-channels").innerHTML =
        "Leave Second Channel";
    } else {
      isMultipleChannel = false;
      // Leave the channel.
      await agoraEngineSubscriber.leave();
    }
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
    handleChannelMediaRelay,
    handleMultipleChannels,
  };
};

export default AgoraManagerMultiChannel;
