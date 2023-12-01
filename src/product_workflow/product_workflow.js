import AgoraManagerProductWorkflow from "../product_workflow/agora_manager_product_workflow.js";
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
  // A variable to hold the screen track.
  screenTrack: null,
};

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();
  var isSharingEnabled = false;
  var isMuteVideo = false;

  const handleVSDKEvents = async (eventName, ...args) => {
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
      case "microphone-changed":
        // When plugging in a device, switch to a device that is newly plugged in.
        if (changedDevice.state === "ACTIVE") {
          channelParameters.localAudioTrack.setDevice(
            changedDevice.device.deviceId
          );
          // Switch to an existing device when the current device is unplugged.
        } else if (
          changedDevice.device.label ===
          channelParameters.localAudioTrack.getTrackLabel()
        ) {
          const oldMicrophones = await AgoraRTC.getMicrophones();
          oldMicrophones[0] &&
            channelParameters.localAudioTrack.setDevice(
              oldMicrophones[0].deviceId
            );
        }
      case "camera-changed":
        // When plugging in a device, switch to a device that is newly plugged in.
        if (changedDevice.state === "ACTIVE") {
          channelParameters.localVideoTrack.setDevice(
            changedDevice.device.deviceId
          );
          // Switch to an existing device when the current device is unplugged.
        } else if (
          changedDevice.device.label ===
          channelParameters.localVideoTrack.getTrackLabel()
        ) {
          const oldCameras = await AgoraRTC.getCameras();
          oldCameras[0] &&
            channelParameters.localVideoTrack.setDevice(oldCameras[0].deviceId);
        }
    }
  };

  const agoraManager = await AgoraManagerProductWorkflow(handleVSDKEvents);

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

  document.getElementById("initScreen").onclick = async function () {
    if (isSharingEnabled == false) {
      agoraManager.startScreenShare(channelParameters, localPlayerContainer);
      // Update the button text.
      document.getElementById(`initScreen`).innerHTML = "Stop Sharing";
      // Update the screen sharing state.
      isSharingEnabled = true;
    } else {
      agoraManager.stopScreenShare(channelParameters, localPlayerContainer);
      // Update the button text.
      document.getElementById(`initScreen`).innerHTML = "Share Screen";
      // Update the screen sharing state.
      isSharingEnabled = false;
    }
  };

  // Set an event listener on the range slider.
  document
    .getElementById("localAudioVolume")
    .addEventListener("change", function (evt) {
      console.log("Volume of local audio :" + evt.target.value);
      // Set the local audio volume.
      channelParameters.localAudioTrack.setVolume(parseInt(evt.target.value));
    });

  // Set an event listener on the range slider.
  document
    .getElementById("remoteAudioVolume")
    .addEventListener("change", function (evt) {
      console.log("Volume of remote audio :" + evt.target.value);
      // Set the remote audio volume.
      channelParameters.remoteAudioTrack.setVolume(parseInt(evt.target.value));
    });

  // Mute and unmute the local video.
  document.getElementById("muteVideo").onclick = async function () {
    if (isMuteVideo == false) {
      // Mute the local video.
      channelParameters.localVideoTrack.setEnabled(false);
      // Update the button text.
      document.getElementById(`muteVideo`).innerHTML = "Unmute Video";
      isMuteVideo = true;
    } else {
      // Unmute the local video.
      channelParameters.localVideoTrack.setEnabled(true);
      // Update the button text.
      document.getElementById(`muteVideo`).innerHTML = "Mute Video";
      isMuteVideo = false;
    }
  };
};

function removeVideoDiv(elementId) {
  console.log("Removing " + elementId + "Div");
  let Div = document.getElementById(elementId);
  if (Div) {
    Div.remove();
  }
}
