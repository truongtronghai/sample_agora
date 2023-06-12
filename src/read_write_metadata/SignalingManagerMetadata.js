import SignalingManager from '../SignalingManager/SignalingManager.js';

const SignalingManagerMetadata = async (messageCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(messageCallback);

  // Add additional methods or override existing methods
  const extendedMethod = () => {
    // Custom functionality
  };

  // Override an existing method
  signalingManager.join = async () => {
    // Add custom logic before calling the original join method
    // ...

    // Call the original join method
    await signalingManager.join();

    // Add custom logic after calling the original join method
    // ...
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    extendedMethod
  };
};

export default SignalingManagerMetadata;
