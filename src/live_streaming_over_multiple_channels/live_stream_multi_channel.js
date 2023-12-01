import AgoraManagerMultiChannel from "./agora_manager_multi_channel.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import docURLs from "../utils/docSteURLs.js";

// A variable to track the co-hosting state.
var isCoHost = false;
// The destination channel name you want to join.
var destChannelName = "";
//In a production app, the user adds the channel name and you retrieve the
// authentication token from a token server.
var destChannelToken = "";
// A variable to track the multiple channel state.
var isMultipleChannel = false;
// Local user role.
var clientRole = "host";
// The second channel name you want to join.
var secondChannelName = "";
//In a production app, the user adds the channel name and you retrieve the
// authentication token from a token server.
var secondChannelToken = "";

let channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a local video track.
  localVideoTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold a remote video track.
  remoteVideoTrack: null,
  // A variable to hold the remote user id.s
  remoteUid: null,
};

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  const handleVSDKEvents = (eventName, ...args) => {
    switch (eventName) {
      case "user-published":
        if (args[1] == "video") {
          // Retrieve the remote video track.
          channelParameters.remoteVideoTrack = args[0].videoTrack;
          // Retrieve the remote audio track.
          channelParameters.remoteAudioTrack = args[0].audioTrack;
          // Save the remote user id for reuse.
          channelParameters.remoteUid = args[0].uid.toString();
          // Specify the ID of the DIV container. You can use the uid of the remote user.
          remotePlayerContainer.id = args[0].uid.toString();
          channelParameters.remoteUid = args[0].uid.toString();
          remotePlayerContainer.textContent =
            "Remote user " + args[0].uid.toString();
          // Append the remote container to the page body.
          document.body.append(remotePlayerContainer);
          // Play the remote video track.
          channelParameters.remoteVideoTrack.play(remotePlayerContainer);
        }
        // Subscribe and play the remote audio track If the remote user publishes the audio track only.
        if (args[1] == "audio") {
          // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
          channelParameters.remoteAudioTrack = args[0].audioTrack;
          // Play the remote audio track. No need to pass any DOM element.
          channelParameters.remoteAudioTrack.play();
        }
    }
  };

  const agoraManager = await AgoraManagerMultiChannel(handleVSDKEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML =
    agoraManager.config.channelName;
  // Display User name
  document.getElementById("userId").innerHTML = agoraManager.config.uid;

  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.createElement("div");
  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.createElement("div");
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = agoraManager.config.uid;
  // Set the textContent property of the local video container to the local user id.
  localPlayerContainer.textContent = "Local user " + agoraManager.config.uid;
  // Set the local video container size.
  localPlayerContainer.style.width = "640px";
  localPlayerContainer.style.height = "480px";
  localPlayerContainer.style.padding = "15px 5px 5px 5px";
  // Set the remote video container size.
  remotePlayerContainer.style.width = "640px";
  remotePlayerContainer.style.height = "480px";
  remotePlayerContainer.style.padding = "15px 5px 5px 5px";

  // Listen to the Join button click event.
  document.getElementById("join").onclick = async function () {
    // Join a channel.
    await agoraManager.join(localPlayerContainer, channelParameters);
    console.log("publish success!");
  };
  // Listen to the Leave button click event.
  document.getElementById("leave").onclick = async function () {
    removeVideoDiv(remotePlayerContainer.id);
    removeVideoDiv(localPlayerContainer.id);
    // Leave the channel
    await agoraManager.leave(channelParameters);
    agoraManager.stopProxyServer();
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
  };

  document.getElementById("coHost").onclick = async function () {
    //Keep the same UID for this user.
    var destUID = agoraManager.config.uid;
    agoraManager.handleChannelMediaRelay(
      isCoHost,
      destUID,
      destChannelName,
      destChannelToken
    );
    isCoHost = !isCoHost;
  };

  // Listen to the host radio button click event.
  document.getElementById("host").onclick = async function () {
    // Check if the user selected the Host radio button.
    if (document.getElementById("host").checked) {
      // Save the selected role in a variable for reuse.
      clientRole = "host";
    }
  };

  document.getElementById("audience").onclick = async function () {
    // Check if the user selected the Audience radio button.
    if (document.getElementById("audience").checked) {
      // Save the selected role in a variable for reuse.
      clientRole = "audience";
    }
  };

  document.getElementById("multiple-channels").onclick = async function () {
    // Check to see if the user has already joined a channel.
    agoraManager.handleMultipleChannels(isMultipleChannel, clientRole, secondChannelName, secondChannelToken, channelParameters);
    isMultipleChannel = !isMultipleChannel;
  };
};

function removeVideoDiv(elementId) {
  console.log("Removing " + elementId + "Div");
  let Div = document.getElementById(elementId);
  if (Div) {
    Div.remove();
  }
}
