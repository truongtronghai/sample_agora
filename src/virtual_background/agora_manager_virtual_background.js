import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";
import VirtualBackgroundExtension from "agora-extension-virtual-background";

const AgoraManagerVirtualBackground = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  var counter = 0; // to cycle through the different types of backgrounds
  var isVirtualBackGroundEnabled = false;

  // Create a VirtualBackgroundExtension instance
  const extension = new VirtualBackgroundExtension();
  // Check browser compatibility virtual background extension
  if (!extension.checkCompatibility()) {
    console.error("Does not support Virtual Background!");
    // Handle exit code
  }
  // Register the extension
  AgoraRTC.registerExtensions([extension]);
  let processor = null;

  // Initialization
  async function getProcessorInstance(channelParameters) {
    if (!processor && channelParameters.localVideoTrack) {
      // Create a VirtualBackgroundProcessor instance
      processor = extension.createProcessor();

      try {
        // Initialize the extension and pass in the URL of the Wasm file
        await processor.init("./assets/wasms");
      } catch (e) {
        console.log("Fail to load WASM resource!");
        return null;
      }
      // Inject the extension into the video processing pipeline in the SDK
      channelParameters.localVideoTrack
        .pipe(processor)
        .pipe(channelParameters.localVideoTrack.processorDestination);
    }
    return processor;
  }

  // Set a solid color as the background
  async function setBackgroundColor(channelParameters) {
    if (channelParameters.localVideoTrack) {
      let processor = await getProcessorInstance(channelParameters);
      processor.setOptions({ type: "color", color: "#00ff00" });
      await processor.enable();

      isVirtualBackGroundEnabled = true;
    }
  }

  // Blur the user's actual background
  async function setBackgroundBlurring(channelParameters) {
    if (channelParameters.localVideoTrack) {
      let processor = await getProcessorInstance(channelParameters);
      processor.setOptions({ type: "blur", blurDegree: 2 });
      await processor.enable();

      isVirtualBackGroundEnabled = true;
    }
  }

  // Set an image as the background
  async function setBackgroundImage(channelParameters) {
    const imgElement = document.createElement("img");

    imgElement.onload = async () => {
      let processor = await getProcessorInstance(channelParameters);
      processor.setOptions({ type: "img", source: imgElement });
      await processor.enable();

      isVirtualBackGroundEnabled = true;
    };
    imgElement.src = "./background.jpg";
  }

  // Disable background
  async function disableBackground(channelParameters) {
    let processor = await getProcessorInstance(channelParameters);
    processor.disable();

    isVirtualBackGroundEnabled = false;
  }

  const virtualBackground = (channelParameters) => {
    counter++;
    if (counter > 3) {
      counter = 0;
      disableBackground(channelParameters);
      console.log("Virtual background turned off");
    } else {
      isVirtualBackGroundEnabled = true;
    }
    // Set the type of virtual background
    if (counter == 1) {
      // Set background blur
      setBackgroundBlurring(channelParameters);
      console.log("Blur background enabled");
    } else if (counter == 2) {
      // Set a solid background color
      setBackgroundColor(channelParameters);
      console.log("Color background enabled");
    } else if (counter == 3) {
      // Set a background image
      setBackgroundImage(channelParameters);
      console.log("Image background enabled");
    }
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
  };
};

export default AgoraManagerVirtualBackground;
