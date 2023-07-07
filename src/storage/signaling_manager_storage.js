import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerStorage = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback
  );

  const whoNow = async function (channelName, channelType) {
    const result = await signalingManager
      .getSignalingEngine()
      .presence.whoNow(channelName, channelType);
    return result;
  };

  const setUserMetadata = async function (uid, key, value) {
    // Define a data array to hold key-value pairs
    const data = [
      {
        key: key,  // Metadata Item's key
        value: value,  // Metadata Item's value
        revision: -1, // Versioning switch on write operations:
        // -1: Turn off version checking.
        // > 0, The target revision number must match this value for the operation to succeed.
      },
    ];

    const options = {
      userId: uid, // current user's uid
      majorRevision: -1, // Version control switch, -1 => Turn off version checking
      addTimeStamp: true, // Whether to record timestamps of edits
      addUserId: true, // Whether to log the editor's user ID
    };

    try {
      await signalingManager.getSignalingEngine()
        .storage.setUserMetadata(data, options);
      messageCallback(`User metadata key ${key} saved`);
    } catch (status) {
        console.log(status);
    }
  };

  const updateUserMetadata = async function (uid, key, value) {
    // Define a data array to hold key-value pairs
    const data = [
      {
        key: key,  // Metadata Item's key
        value: value,  // Metadata Item's value
        revision: -1, // Versioning switch on write operations:
        // -1: Turn off version checking
        // > 0, The target revision number must match this value for the operation to succeed.
      },
    ];

    const options = {
      userId: uid, // current user's uid
      majorRevision: -1, // Version control switch, -1 => Turn off version checking
      addTimeStamp: true, // Whether to record timestamps of edits
      addUserId: true, // Whether to log the editor's user ID
    };

    try {
      await signalingManager.getSignalingEngine()
        .storage.updateUserMetadata(data, options);
      messageCallback(`User metadata key ${key} saved`);
    } catch (status) {
        console.log(status);
    }
  };

  const getUserMetadata = async function (uid) {
    try {
      const result = await signalingManager
        .getSignalingEngine()
        .storage.getUserMetadata({ userId: uid });
      return result.metadata;
    } catch (status) {
      console.log(status);
    }
  };

  const setChannelMetadata = async function (channelName, key, value) {
    // Define a data array to hold key-value pairs
    const data = [
      {
        key: key,  // Metadata Item's key
        value: value,  // Metadata Item's value
        revision: -1, // Versioning switch on write operations:
        // -1: Turn off version checking.
        // > 0, The target revision number must match this value for the operation to succeed.
      },
    ];

    const options = {
      majorRevision: -1,
      lockName: "", // After setting a lock, only the user who calls the acquireLock method to acquire the lock can perform the operation.
      addTimeStamp: true,
      addUserId: true,
    };

    try {
      const result = await signalingManager
        .getSignalingEngine()
        .storage.setChannelMetadata(channelName, "MESSAGE", data, options);
      messageCallback(`channel metadata ${key} set successfully`);
    } catch (status) {
      console.log(status);
    }
  };

  const getChannelMetadata = async function (channelName, channelType) {
    try {
      const result = await signalingManager
        .getSignalingEngine()
        .storage.getChannelMetadata(channelName, channelType);
      return result.metadata;
    } catch (status) {
      console.log(status);
    }
  };

  const subscribeUserMetadata = async function (uid) {
    try {
      const result = await signalingManager
        .getSignalingEngine()
        .storage.subscribeUserMetadata(uid);
      messageCallback("Subscribed to metadata events from " + uid);
    } catch (status) {
      console.log(status);
    }
  }
  // Return the extended signaling manager
  return {
    ...signalingManager,
    whoNow,
    setUserMetadata,
    updateUserMetadata,
    getUserMetadata,
    subscribeUserMetadata,
    setChannelMetadata,
    getChannelMetadata,
  };
};

export default SignalingManagerStorage;
