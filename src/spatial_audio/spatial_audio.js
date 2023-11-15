import AgoraManagerSpatialAudio from "../spatial_audio/agora_manager_spatial_audio.js";
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
  // A variable to hold the media file track.
  mediaPlayerTrack: null,
};

var distance = 0; // Used to define and change the the spatial position
var isMediaPlaying = false;

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
          // Create a  new SpatialAudioProcessor for the remote user
          const processor = spatialAudioExtension.createProcessor();
          // Add the processor to the Map for future use
          agoraManager.processors.set(user.uid.toString(), processor);

          // Inject the SpatialAudioProcessor into the audio track
          const track = user.audioTrack;
          track.pipe(processor).pipe(track.processorDestination);

          // Play the remote audio track.
          track.play();
          channelParameters.remoteAudioTrack = user.audioTrack;
        }
    }
  };

  const agoraManager = await AgoraManagerSpatialAudio(handleVSDKEvents);

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

  document.getElementById("decreaseDistance").onclick = async function () {
    distance -= 5;
    document.getElementById("distanceLabel").textContent = distance;
    agoraManager.updatePosition(distance, channelParameters);
  };

  document.getElementById("increaseDistance").onclick = async function () {
    distance += 5;
    document.getElementById("distanceLabel").textContent = distance;
    agoraManager.updatePosition(distance, channelParameters);
  };

  document.getElementById("playAudioFile").onclick =
    async function localPlayerStart() {
      if (isMediaPlaying) {
        channelParameters.mediaPlayerTrack.stop();
        isMediaPlaying = false;
        document.getElementById("playAudioFile").textContent =
          "Play audio file";
        return;
      }

      let track = agoraManager.playMediaWithSpatialAudio();
      console.log(track)

      isMediaPlaying = true;
      document.getElementById("playAudioFile").textContent =
        "Stop playing audio";
      channelParameters.mediaPlayerTrack = track;
    };
};

function removeVideoDiv(elementId) {
  console.log("Removing " + elementId + "Div");
  let Div = document.getElementById(elementId);
  if (Div) {
    Div.remove();
  }
}
