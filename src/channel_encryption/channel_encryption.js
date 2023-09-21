import AgoraChannelEncryption from "./agora_manager_channel_encryption.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import docURLs from "../utils/docSteURLs.js";

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

var password;
var uid;

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  const handleVSDKEvents = (eventName, ...args) => {
    switch (eventName) {
      case "user-published":
        var browserName = (function (agent) {
          switch (true) {
            case agent.indexOf("chrome") > -1 && !!window.chrome:
              return "Chrome";
            default:
              return "other";
          }
        })(window.navigator.userAgent.toLowerCase());

        if (browserName === "Chrome") {
          const transceiver =
            channelParameters.remoteVideoTrack.getRTCRtpTransceiver();
          if (!transceiver || !transceiver.receiver) {
            return;
          }
          password = document.getElementById("password").value.toString();
          setDecryptionStream(transceiver.receiver, password);
        }
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

  const agoraManager = await AgoraChannelEncryption(handleVSDKEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML =
    agoraManager.config.channelName;
  uid = document.getElementById("userId").value.toString();
  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.createElement("div");
  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.createElement("div");
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = uid;
  // Set the textContent property of the local video container to the local user id.
  localPlayerContainer.textContent = "Local user " + uid;
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
    // Join a channel with password
    password = document.getElementById("password").value.toString();
    uid = document.getElementById("userId").value.toString();
    await agoraManager.joinWithE2EEncryption(
      localPlayerContainer,
      channelParameters,
      password,
      uid
    );
    // await agoraManager.enableEndToEndEncryption(channelParameters.localVideoTrack)
    console.log("publish success!");
  };

  // Listen to the Leave button click event.
  document.getElementById("leave").onclick = async function () {
    removeVideoDiv(remotePlayerContainer.id);
    removeVideoDiv(localPlayerContainer.id);
    // Leave the channel
    await agoraManager.leave(channelParameters);
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
  };
};

function removeVideoDiv(elementId) {
  console.log("Removing " + elementId + "Div");
  let Div = document.getElementById(elementId);
  if (Div) {
    Div.remove();
  }
}
