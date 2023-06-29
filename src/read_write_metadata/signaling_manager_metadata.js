import SignalingManager from '../signaling_manager/signaling_manager.js';

const SignalingManagerMetadata = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(messageCallback, eventsCallback);

  const handleMetadataEvents = async function () {
    
    // Add storage event listener
    rtm.addEventListener({
      storage : event => {
          // event.channelType;      // Channel type, 'STREAM' or 'MESSAGE'.
          // event.channelName;      // Channel name
          // event.publisher;        // User triggers this event
          // event.storageType;      // Category of the metadata, 'USER or 'CHANNEL'
          // event.eventType;        // Action type, 'SNAPSHOT', 'SET', 'REMOVE', 'UPDATE' or 'NONE'
          // event.data;             // User metadata or channel metadata payload

          const eventArgs = { 
            event: event,
          }
          eventsCallback("Storage", eventArgs)
      },
    });

    /* signalingManager.signalingEngine.on("UserMetaDataUpdated", function (uid, rtmMetadata) {
      if (typeof rtmMetadata !== "undefined") {
        const eventArgs = { uid: uid, rtmMetadata: rtmMetadata }
        eventsCallback("UserMetaDataUpdated", eventArgs)
      }
    });   */
  }

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
        const result = await signalingManager.signalingEngine.storage.setUserMetadata(data);
        console.log(result);
    } catch (status) {
        console.log(status);
    };
  }

  const updateUserMetadata = async function (uid, key, value) {

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
        const result = await signalingManager.signalingEngine.storage.setUserMetadata(data);
        console.log(result);
    } catch (status) {
        console.log(status);
    }
  };
  

  // Return the extended signaling manager
  return {
    ...signalingManager,
    setUserMetadata,
    handleMetadataEvents,
    updateUserMetadata,
  };
};

export default SignalingManagerMetadata;
