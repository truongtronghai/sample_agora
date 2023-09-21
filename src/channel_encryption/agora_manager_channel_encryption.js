import AgoraManager from "../agora_manager/agora_manager.js";

const AgoraChannelEncryption = async (eventsCallback) => {
  // Extend the AgoraManager by importing it
  const agoraManager = await AgoraManager(eventsCallback);
  const config = agoraManager.config;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Fetches the token for stream channels
  async function fetchToken(uid, channelName) {
    if (config.serverUrl !== "") {
      try {
        const res = await fetch(
          config.proxyUrl +
            config.serverUrl +
            "/rtc/" +
            channelName +
            "/" +
            role +
            "/uid/" +
            uid +
            "/?expiry=" +
            config.tokenExpiryTime,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
        const data = await res.text();
        const json = await JSON.parse(data);
        console.log("Video SDK token fetched from server: ", json.rtcToken);
        return json.rtcToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return config.token;
    }
  }

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
  encryptionSaltBase64 = base64ToUint8Array(config.salt);
  // Convert the encryptionKey string to hex2ascii.
  encryptionKey = hex2ascii(config.cipherKey);
  // Set an encryption mode.
  encryptionMode = config.encryptionMode;

  agoraManager
    .getAgoraEngine()
    .setEncryptionConfig(encryptionMode, encryptionKey, encryptionSaltBase64);

  const joinWithE2EEncryption = async (
    localPlayerContainer,
    channelParameters,
    password,
    uid
  ) => {
    AgoraRTC.setParameter("ENABLE_ENCODED_TRANSFORM", true);
    const token = await fetchToken(uid, config.channelName);
    await agoraManager
      .getAgoraEngine()
      .join(config.appId, config.channelName, token, uid);
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Append the local video container to the page body.
    document.body.append(localPlayerContainer);
    // Publish the local audio and video tracks in the channel.
    await agoraManager
      .getAgoraEngine()
      .publish([
        channelParameters.localAudioTrack,
        channelParameters.localVideoTrack,
      ]);
    const transceiver =
      channelParameters.localVideoTrack.getRTCRtpTransceiver();
    if (!transceiver || !transceiver.sender) {
      return;
    }
    const sender = transceiver.sender;

    var browserName = (function (agent) {
      switch (true) {
        case agent.indexOf("chrome") > -1 && !!window.chrome:
          return "Chrome";
        default:
          return "other";
      }
    })(window.navigator.userAgent.toLowerCase());

    if (browserName === "Chrome") {
      setEncryptionStream(sender, password);
    }
    // Play the local video track.
    channelParameters.localVideoTrack.play(localPlayerContainer);
  };

  async function setEncryptionStream(sender, password) {
    const streams = sender.createEncodedStreams();
    const transformer = new TransformStream({
      async transform(chunk, controller) {
        // controller.enqueue(chunk);
        //   return;

        const originView = new Uint8Array(chunk.data);

        let reservedSize = 40;

        const naluType = originView[4] & 0x1f;
        console.log(naluType);
        if (naluType !== 7) {
          reservedSize = 5;
        }

        const payload = originView.subarray(reservedSize, originView.length);
        const hashKey = await grindKey(password, 10);
        const key = await window.crypto.subtle.importKey(
          "raw",
          hashKey,
          {
            name: "AES-GCM",
          },
          false,
          ["encrypt"]
        );

        const iv = await getIv(password);

        const ciphertext = await window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: iv,
            tagLength: 128,
          },
          key,
          payload
        );

        const encryptedView = new Uint8Array(
          ciphertext.byteLength + reservedSize + 12
        );
        encryptedView.set(originView.subarray(0, reservedSize));
        encryptedView.set(iv, reservedSize);
        encryptedView.set(new Uint8Array(ciphertext), reservedSize + 12);
        chunk.data = encryptedView.buffer;

        controller.enqueue(chunk);
      },
    });

    streams.readable.pipeThrough(transformer).pipeTo(streams.writable);
  }

  async function setDecryptionStream(receiver, password) {
    const streams = receiver.createEncodedStreams();
    const transformer = new TransformStream({
      async transform(chunk, controller) {
        // controller.enqueue(chunk);
        //   return;

        const originView = new Uint8Array(chunk.data);

        let reservedSize = 40;

        const naluType = originView[4] & 0x1f;
        if (naluType !== 7) {
          // controller.enqueue(chunk);
          // return;
          reservedSize = 5;
        }

        const hashKey = await grindKey(password, 10);
        const key = await window.crypto.subtle.importKey(
          "raw",
          hashKey,
          {
            name: "AES-GCM",
          },
          false,
          ["decrypt"]
        );

        const header = originView.subarray(0, reservedSize);
        const iv = originView.subarray(reservedSize, reservedSize + 12);
        const payload = originView.subarray(
          reservedSize + 12,
          chunk.data.byteLength
        );

        let decrypted = null;
        try {
          decrypted = await window.crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: iv,
              tagLength: 128,
            },
            key,
            payload
          );
        } catch (e) {
          console.log(e);
          controller.enqueue(chunk);
          return;
        }

        const decryptedView = new Uint8Array(
          decrypted.byteLength + reservedSize
        );
        decryptedView.set(header);
        decryptedView.set(new Uint8Array(decrypted), reservedSize);
        chunk.data = decryptedView.buffer;

        controller.enqueue(chunk);
      },
    });

    streams.readable.pipeThrough(transformer).pipeTo(streams.writable);
  }

  // Return the extended agora manager
  return {
    ...agoraManager,
    joinWithE2EEncryption,
    setDecryptionStream,
  };
};

export default AgoraChannelEncryption;
