import AgoraManager from "../agora_manager/agora_manager.js";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AIDenoiserExtension } from "agora-extension-ai-denoiser";

const AgoraManagerAINoiseSuppression = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);

  // Get the config
  const config = agoraManager.config;

  const enableAIDenoiser = async (channelParameters) => {
    // Create an AIDenoiserExtension instance, and pass in the host URL of the Wasm files
    const denoiser = new AIDenoiserExtension({ assetsPath: "/node_modules/agora-extension-ai-denoiser/external/" });
    // Check compatibility
    if (!denoiser.checkCompatibility()) {
      // The extension might not be supported in the current browser. You can stop executing further code logic
      console.error("Does not support AI Denoiser!");
    }
    // Register the extension
    AgoraRTC.registerExtensions([denoiser]);
    // (Optional) Listen for the callback reporting that the Wasm files fail to load
    denoiser.onloaderror = (e) => {
      // If the Wasm files fail to load, you can disable the plugin, for example:
      // openDenoiserButton.enabled = false;
      console.log(e);
    };

    // Create a processor
    const processor = denoiser.createProcessor();

    // Inject the extension to the audio processing pipeline
    channelParameters.localAudioTrack
      .pipe(processor)
      .pipe(channelParameters.localAudioTrack.processorDestination);
    
    await processor.enable();

    // Listen for the callback reporting that the noise suppression process takes too long
    processor.onoverload = async (elapsedTime) => {
      console.log("overload!!!");
      // Switch from AI noise suppression to stationary noise suppression
      await processor.setMode("STATIONARY_NS");
      // Disable AI noise suppression
      await processor.disable();
    };

    // Setup logging
    processor.ondump = (blob, name) => {
      // Dump the audio data to a local folder in PCM format
      const objectURL = URL.createObjectURL(blob);
      const tag = document.createElement("a");
      tag.download = name;
      tag.href = objectURL;
      tag.click();
      setTimeout(() => {URL.revokeObjectURL(objectURL);}, 0);
    }
    
    processor.ondumpend = () => {
      console.log("dump ended!!");
    }
    
    processor.dump();
  };

  // Return the extended agora manager
  return {
    ...agoraManager,
    enableAIDenoiser,
  };
};

export default AgoraManagerAINoiseSuppression;
