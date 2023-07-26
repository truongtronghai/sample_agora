import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerStorage = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback
  );

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

  const setChannelMetadata = async function (channelName, key, value, revision, lockName) {
    // Define a data array to hold key-value pairs
    const data = [
      {
        key: key,  // Metadata Item's key
        value: value,  // Metadata Item's value
        revision: revision, // Versioning switch on write operations:
        // -1: Turn off version checking.
        // > 0, The target revision number must match this value for the operation to succeed.
      },
    ];

    const options = {
      majorRevision: -1, // Use this field to enable version number verification of the entire set of channel attributes.
      lockName: lockName, // When you specify a lock, only the user who calls the acquireLock method to acquire the lock can perform the operation.
      addTimeStamp: true,
      addUserId: true,
    };

    try {
      const result = await signalingManager
        .getSignalingEngine()
        .storage.setChannelMetadata(channelName, "MESSAGE", data, options);
      messageCallback(`channel metadata key '${key}' set successfully`);
    } catch (status) {
      messageCallback(`Error setting channel metadata: ${status.reason}`)
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
  // Manage locks
  const setLock = async function (channelName, channelType, lockName, ttl) {
    // Create a new lock
    try{
      const result = await signalingManager
      .getSignalingEngine().lock.setLock(
          channelName, channelType, lockName, { ttl: ttl }
      );
    } catch (status) {
      messageCallback(status.reason);
    }
  }

  const acquireLock = async function (channelName, channelType, lockName, retry) {
    // Acquire exclusive use of the named lock
    try{
      const result = await signalingManager
      .getSignalingEngine().lock.acquireLock(
          channelName, channelType, lockName,  {retry: retry}
      );
    } catch (status) {
      messageCallback(status.reason);
    }
  }

  const releaseLock = async function (channelName, channelType, lockName) {
    // Release a lock after use to make it available for others
    try{
      const result = await signalingManager
      .getSignalingEngine().lock.releaseLock(
          channelName, channelType, lockName,
      );
    } catch (status) {
      messageCallback(status.reason);
    }
  }

  const removeLock = async function (channelName, channelType, lockName) {
    // Delete a lock
    try{
      const result = await signalingManager
      .getSignalingEngine().lock.removeLock(
          channelName, channelType, lockName,
      );
    } catch (status) {
      messageCallback(status.reason);
    }
  }

  const getLock = async function (channelName, channelType) {
    // Get details of all current locks in the channel
    try{
      const result = await signalingManager
      .getSignalingEngine().lock.getLock(
          channelName, channelType
      );
      messageCallback(`getLock succeeded. Total ${result.totalLocks } locks: ${JSON.stringify(result.lockDetails)}`)
    } catch (status) {
      messageCallback(status.reason);
    }
  }
  
  // Return the extended signaling manager
  return {
    ...signalingManager,
    setUserMetadata,
    updateUserMetadata,
    getUserMetadata,
    subscribeUserMetadata,
    setChannelMetadata,
    getChannelMetadata,
    setLock,
    acquireLock,
    releaseLock,
    removeLock,
    getLock,
  };
};

export default SignalingManagerStorage;
