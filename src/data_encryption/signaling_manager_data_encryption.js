import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerDataEncryption = async (
  messageCallback,
  eventsCallback
) => {
  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // In a production environment, you retrieve the key and salt from
  // an authentication server. For this code example you generate locally.

  var encryptionKey = "";
  var encryptionSaltBase64 = "";
  var encryptionMode = "";

  function base64ToUint8Array(base64Str) {
    const raw = window.atob(base64Str);
    const result = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i += 1) {
      result[i] = raw.charCodeAt(i);
    }
    return result;
  }

  function hex2ascii(hexx) {
    const hex = hexx.toString(); //force conversion
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  // Convert the encryptionSaltBase64 string to base64ToUint8Array.
  encryptionSaltBase64 = base64ToUint8Array(config.encryptionSaltBase64);
  // Convert the encryptionKey string to hex2ascii.
  encryptionKey = hex2ascii(config.encryptionKey);
  // Set an encryption mode.
  encryptionMode = config.encryptionMode;
  // Start channel encryption
  const rtmConfig = {
    token: config.token,
    logLevel: "debug",
    useStringUserId: true,
    encryptionMode: encryptionMode,
    salt: encryptionSaltBase64,
    cipherKey: encryptionKey,
  };

  // Signaling Manager will create the engine and channel for you
  const signalingManager = await SignalingManager(showMessage, handleSignalingEvents, rtmConfig);

  // Return the extended signaling manager
  return {
    ...signalingManager,
  };
};

export default SignalingManagerDataEncryption;
