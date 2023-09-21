import AgoraCallQuality from "../call_quality/agora_manager_call_quality.js";
import showMessage from "../utils/showMessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import docURLs from "../utils/docSteURLs.js";

// A variable to track the state of remote video quality.
var isHighRemoteVideoQuality = false;
// A variable to track the state of device test.
var isDeviceTestRunning = false;
// Variables to hold the Audio/Video tracks for device testing.
var testTracks;
// A variable to reference the audio devices dropdown.
var audioDevicesDropDown;
// A variable to reference the video devices dropdown.
var videoDevicesDropDown;

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
  remoteUid: "1",
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

          // Change stream quality on click
          document.getElementById(remotePlayerContainer.id).addEventListener("click", function () {
            if (isHighRemoteVideoQuality === false) {
              agoraManager.setRemoteVideoStreamType(channelParameters.remoteUid, 0);
              isHighRemoteVideoQuality = true;
            } else {
              agoraManager.setRemoteVideoStreamType(channelParameters.remoteUid, 1);
              isHighRemoteVideoQuality = false;
            }
          });
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
      case "connection-state-change":
        // The sample code uses debug console to show the connection state. In a real-world application, you can add
        // a label or a icon to the user interface to show the connection state.

        // Display the current connection state.
        console.log("Connection state has changed to :" + args[0]);
        // Display the previous connection state.
        console.log("Connection state was : " + args[1]);
        // Display the connection state change reason.
        console.log("Connection state change reason : " + args[2]);
    }
  };

  const agoraManager = await AgoraCallQuality(handleVSDKEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML =
    agoraManager.config.channelName;
  // Display User name
  document.getElementById("userId").innerHTML = agoraManager.config.uid;

  // Get an instance of the Agora Engine from the manager
  const agoraEngine = await agoraManager.getAgoraEngine();

  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.createElement("div");
  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.createElement("div");
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = agoraManager.config.uid;
  remotePlayerContainer.id = "1"; // initialize, will be updated when user joins
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

  audioDevicesDropDown = document.getElementById("audioDevices");
  videoDevicesDropDown = document.getElementById("videoDevices");
  const devices = await agoraManager.getDevices();
  for (let i = 0; i < devices.audioDevices.length; i++) {
    var option = document.createElement("option");
    option.text = devices.audioDevices[i].label;
    option.value = devices.audioDevices[i].deviceId;
    audioDevicesDropDown.appendChild(option);
  }
  for (let i = 0; i < devices.videoDevices.length; i++) {
    var option = document.createElement("option");
    option.text = devices.videoDevices[i].label;
    option.value = devices.videoDevices[i].deviceId;
    videoDevicesDropDown.appendChild(option);
  }

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
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
  };

  document.getElementById("statistics").onclick = async function () {
    // The sample code uses debug console to show the call-quality statistics. In a real-world application, you can
    // add label or paragraph to the user interface to show the call-quality statistics.

    const stats = await agoraManager.getStatistics(remotePlayerContainer.id);
    console.log(stats);

    console.log(
      "Local audio stats = { sendBytes :" +
        stats.localAudioStats.sendBytes +
        ", sendBitrate :" +
        stats.localAudioStats.sendBitrate +
        ", sendPacketsLost :" +
        stats.localAudioStats.sendPacketsLost +
        " }"
    );

    console.log(
      "Local video stats = { sendBytes :" +
        stats.localVideoStats.sendBytes +
        ", sendBitrate :" +
        stats.localVideoStats.sendBitrate +
        ", sendPacketsLost :" +
        stats.localVideoStats.sendPacketsLost +
        " }"
    );

    if (stats.remoteAudioStats !== undefined) {
      console.log(
        "Remote audio stats = { receiveBytes :" +
          stats.remoteAudioStats.receivedBytes +
          ", receiveBitrate :" +
          stats.remoteAudioStats.receiveBitrate +
          ", receivePacketsLost :" +
          stats.remoteAudioStats.receivePacketsLost +
          "}"
      );
    }

    if (stats.remoteVideoStats !== undefined) {
      console.log(
        " Local video stats = { receiveBytes :" +
          stats.remoteVideoStats.receiveBytes +
          ", receiveBitrate :" +
          stats.remoteVideoStats.receiveBitrate +
          ", receivePacketsLost :" +
          stats.remoteVideoStats.receivePacketsLost +
          " }"
      );
    }

    console.log(
      "Channel statistics = { UserCount :" +
        stats.rtcStats.UserCount +
        ", OutgoingAvailableBandwidth :" +
        stats.rtcStats.OutgoingAvailableBandwidth +
        ", RTT :" +
        stats.rtcStats.RTT +
        " }"
    );
  };

  document.getElementById("testDevices").onclick = async function () {
    console.log(testTracks)
    if (isDeviceTestRunning === false) {
      testTracks = await agoraManager.createTestTracks(videoDevicesDropDown.value, audioDevicesDropDown.value)
      document.body.append(localPlayerContainer);
      (await testTracks.videoTrack).play(localPlayerContainer);
      (await testTracks.audioTrack).play();
      isDeviceTestRunning = true;
      document.getElementById("testDevices").innerHTML = "Stop test";
    } else {
      document.getElementById("testDevices").innerHTML =
        "Start audio/video device test";
      isDeviceTestRunning = false;
      (await testTracks.videoTrack).close();
      (await testTracks.audioTrack).close();
      let Div = document.getElementById(localPlayerContainer.id);
      Div.remove();
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
