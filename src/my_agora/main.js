import AgoraRTC from 'agora-rtc-sdk-ng'
import VirtualBackgroundExtension from 'agora-extension-virtual-background'
import config from '../agora_manager/config.json'

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
}

const AgoraRTCManager = async (eventsCallback) => {
  let agoraEngine = null

  // Setup done in later steps
  // Set up the signaling engine with the provided App ID, UID, and configuration
  const setupAgoraEngine = () => {
    agoraEngine = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp9' })
  }

  setupAgoraEngine()

  //////////Virtual Background////////////
  const extensionVirturalBg = new VirtualBackgroundExtension()
  // Check browser compatibility virtual background extension
  if (!extensionVirturalBg.checkCompatibility()) {
    console.error('====== Does not support Virtual Background! ======')
    // Handle exit code
  }
  // register extension to Agora instance
  AgoraRTC.registerExtensions([extensionVirturalBg])
  // Init virtual background process
  let virtualBgProcessor = null

  // Initialization
  async function getProcessorInstance(channelParameters) {
    // if (!virtualBgProcessor && channelParameters.localVideoTrack) {
    if (channelParameters.localVideoTrack) {
      // Create a VirtualBackgroundProcessor instance
      virtualBgProcessor = extensionVirturalBg.createProcessor()

      try {
        // Initialize the extension and pass in the URL of the Wasm file
        await virtualBgProcessor.init('./assets/wasms')
      } catch (e) {
        console.log('Fail to load WASM resource!')
        return null
      }
      // Inject the extension into the video processing pipeline in the SDK
      channelParameters.localVideoTrack
        .pipe(virtualBgProcessor)
        .pipe(channelParameters.localVideoTrack.processorDestination)
    }
    return virtualBgProcessor
  }
  // Blur the user's actual background
  async function setBackgroundBlurring(channelParameters) {
    // // MUST refresh before setting new effect
    if (virtualBgProcessor) virtualBgProcessor.unpipe()

    if (channelParameters.localVideoTrack) {
      let processor = await getProcessorInstance(channelParameters)
      processor.setOptions({ type: 'blur', blurDegree: 2 })
      await processor.enable()
    }
  }

  // Set an image as the background
  async function setBackgroundImage(channelParameters) {
    // MUST refresh before setting new effect
    if (virtualBgProcessor) virtualBgProcessor.unpipe()

    const imgElement = document.createElement('img')

    imgElement.onload = async () => {
      let processor = await getProcessorInstance(channelParameters)
      processor.setOptions({ type: 'img', source: imgElement })
      await processor.enable()
    }
    imgElement.src = './background.jpg'
  }

  // Set a solid color as the background
  async function setBackgroundColor(channelParameters) {
    if (channelParameters.localVideoTrack) {
      // MUST refresh before setting new effect
      if (virtualBgProcessor) virtualBgProcessor.unpipe()

      let processor = await getProcessorInstance(channelParameters)
      processor.setOptions({ type: 'color', color: '#00ff00' })
      await processor.enable()
    }
  }

  // Disable background
  async function disableBackground(channelParameters) {
    // MUST refresh before setting new effect
    if (virtualBgProcessor) virtualBgProcessor.unpipe()

    let processor = await getProcessorInstance(channelParameters)
    processor.disable()
  }

  const virtualBackground = (channelParameters, type = 0) => {
    switch (type) {
      case 1:
        setBackgroundBlurring(channelParameters)
        console.log('===== Blur background enabled =====')
        break
      case 2:
        setBackgroundImage(channelParameters)
        console.log('===== Background image enabled =====')
        break
      case 3:
        setBackgroundColor(channelParameters)
        console.log('===== Green background enabled =====')
        break
      default:
        disableBackground(channelParameters)
        console.log('===== Disable Virtual Background =====')
    }
  }
  /////////////////////////////////
  const getAgoraEngine = () => {
    return agoraEngine
  }

  const join = async (localPlayerContainer, channelParameters) => {
    await agoraEngine.join(
      config.appId,
      config.channelName,
      config.token,
      config.uid
    )
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack()
    // Create a local video track from the video captured by a camera.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
    console.log(
      'channelParameters when JOIN =============> ',
      channelParameters
    )
    // Append the local video container to the page body.

    console.log('CHILDREN NODES LENGTH ===> ', localPlayerContainer.childNodes)

    document.body.append(localPlayerContainer)
    // Publish the local audio and video tracks in the channel.
    await getAgoraEngine().publish([
      channelParameters.localAudioTrack,
      channelParameters.localVideoTrack,
    ])
    // Play the local video track.
    channelParameters.localVideoTrack.play(localPlayerContainer)
  }

  // Event Listeners
  agoraEngine.on('user-published', async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType)
    console.log('subscribe success')
    // call callback func for UI processing
    eventsCallback('user-published', user, mediaType)
  })

  // Listen for the "user-unpublished" event.
  agoraEngine.on('user-unpublished', (user) => {
    console.log(user.uid + 'has left the channel')
  })

  const leave = async (channelParameters) => {
    // Destroy the local audio and video tracks.

    channelParameters.localAudioTrack.close()
    channelParameters.localVideoTrack.close()
    // reset channelParameters
    channelParameters.localAudioTrack = null
    channelParameters.localVideoTrack = null

    console.log(
      'channelParameters after LEAVE =============> ',
      channelParameters
    )
    // Remove the containers you created for the local video and remote video.
    await agoraEngine.leave()
  }

  // Return the agoraEngine and the available functions
  return {
    getAgoraEngine,
    config,
    join,
    leave,
    virtualBackground,
  }
}

window.onload = async () => {
  // Display channel name
  document.getElementById('channelName').innerHTML = config.channelName
  // Display User name
  document.getElementById('userId').innerHTML = config.uid
  // The eventsCallback callback can be used by the UI to handle all events.
  const handleVSDKEvents = (eventName, ...args) => {
    console.log("I'm HEERRRRRRRRRR")
    switch (eventName) {
      case 'user-published':
        if (args[1] == 'video') {
          // Retrieve the remote video track.
          channelParameters.remoteVideoTrack = args[0].videoTrack
          // Retrieve the remote audio track.
          channelParameters.remoteAudioTrack = args[0].audioTrack
          // Save the remote user id for reuse.
          channelParameters.remoteUid = args[0].uid.toString()
          // Specify the ID of the DIV container. You can use the uid of the remote user.
          remotePlayerContainer.id = args[0].uid.toString()
          channelParameters.remoteUid = args[0].uid.toString()
          remotePlayerContainer.textContent =
            'Remote user ' + args[0].uid.toString()
          // Append the remote container to the page body.
          document.body.append(remotePlayerContainer)
          // Play the remote video track.
          channelParameters.remoteVideoTrack.play(remotePlayerContainer)
        }
        // Subscribe and play the remote audio track If the remote user publishes the audio track only.
        if (args[1] == 'audio') {
          // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
          channelParameters.remoteAudioTrack = args[0].audioTrack
          // Play the remote audio track. No need to pass any DOM element.
          channelParameters.remoteAudioTrack.play()
        }
    }
  }
  // Get an instance of the Agora Manager for using later to call join()
  const agoraManager = await AgoraRTCManager(handleVSDKEvents)
  // Get an instance of the Agora Engine from the manager
  //   const agoraEngine = await agoraManager.getAgoraEngine()

  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.createElement('div')
  // Set the remote video container size.
  remotePlayerContainer.style.width = '640px'
  remotePlayerContainer.style.height = '480px'
  remotePlayerContainer.style.padding = '15px 5px 5px 5px'

  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.createElement('div')
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = config.uid
  // Set the textContent property of the local video container to the local user id.
  localPlayerContainer.textContent = 'Current user on Local ' + config.uid
  // Set the local video container size.
  localPlayerContainer.style.width = '640px'
  localPlayerContainer.style.height = '480px'
  localPlayerContainer.style.padding = '15px 5px 5px 5px'

  // Listen to the Join button click event.
  document.getElementById('join').onclick = async function () {
    // Join a channel.
    console.log('===== Join the channel =====')
    await agoraManager.join(localPlayerContainer, channelParameters)
    // console.log('Channel params ===> ', channelParameters)
    // setting Bg MUST come AFTER join()
    // agoraManager.virtualBackground(channelParameters, 3)
    console.log('===== publish success! =====')
    document.getElementById('join').toggleAttribute('disabled')
  }
  // Listen to the Leave button click event.
  document.getElementById('leave').onclick = async function () {
    // removeVideoDiv(remotePlayerContainer.id)
    removeVideoDiv(localPlayerContainer.id)
    // Leave the channel
    await agoraManager.leave(channelParameters)
    console.log('You left the channel')
    document.getElementById('join').toggleAttribute('disabled')

    // Refresh the page for reuse
    // window.location.reload()
  }

  document.getElementById('normalBg').onclick = function () {
    // setting Bg MUST come AFTER join()
    agoraManager.virtualBackground(channelParameters, 0)
  }
  document.getElementById('blurBg').onclick = function () {
    // setting Bg MUST come AFTER join()
    agoraManager.virtualBackground(channelParameters, 1)
  }
  document.getElementById('imageBg').onclick = function () {
    // setting Bg MUST come AFTER join()
    agoraManager.virtualBackground(channelParameters, 2)
  }

  document.getElementById('greenBg').onclick = function () {
    // setting Bg MUST come AFTER join()
    agoraManager.virtualBackground(channelParameters, 3)
  }
}

function removeVideoDiv(elementId) {
  console.log('Removing ' + elementId + 'Div')
  let Div = document.getElementById(elementId)
  if (Div) {
    Div.remove()
  }
}
