import SignalingManager from '../signaling_manager/signaling_manager.js';

const SignalingManagerMetadata = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(messageCallback, eventsCallback);

  const setUserMetadata = async function (uid, key, value) {
    const data = [
      {
        key : key,
        value : value,
        revision : -1
      },
    ];
    const options = {
      userId : uid,
      majorRevision : -1,
      addTimeStamp : true,
      addUserId : true
    };
    try {
        const result = await signalingManager.signalingEngine.storage.setUserMetadata(data, options);
        messageCallback(`user metadata ${key} set successfully`);
    } catch (status) {
        console.log(status);
    };
  }

  
  const setChannelMetadata = async function (channelName, key, value) {
    const metaData = [
      {
          key : key,
          value : value,
          revision : -1
      },
    ];
    const options = {
        majorRevision : -1,
        lockName: '',
        addTimeStamp : true,
        addUserId : true
    };
    try {
        const result = await signalingManager.signalingEngine.storage.setChannelMetadata(
          channelName, "MESSAGE", metaData, options);
        messageCallback(`channel metadata ${key} set successfully`);
    } catch (status) {
        console.log(status);
    };
  }

  const getChannelMetadata = async function (channelName, channelType) {
    try {
      const result = await signalingManager.signalingEngine.storage.getChannelMetadata(channelName, channelType);
      return result.metadata;
    } catch (status) {
        console.log(status);
    }
  }

  const getUserMetadata = async function (uid) {
    try {
      const result = await signalingManager.signalingEngine.storage.getUserMetadata(uid);
      return result.metadata;
    } catch (status) {
        console.log(status);
    }
  }

  const subscribeUserMetadata = async function (uid) {
      try {
        const result = await signalingManager.signalingEngine.storage.subscribeUserMetadata(uid);
        messageCallback("Subscribed to metadata events from " + uid);
      } catch (status) {
          console.log(status);
      }
  }
  // Return the extended signaling manager
  return {
    ...signalingManager,
    setUserMetadata,
    getUserMetadata,
    subscribeUserMetadata,
    setChannelMetadata,
    getChannelMetadata,
  };
};

export default SignalingManagerMetadata;
