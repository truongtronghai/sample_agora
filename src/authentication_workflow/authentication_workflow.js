import SignalingManager from "../signaling_manager/signaling_manager.js";
import showMessage from "../utils/showmessage.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import handleSignalingEvents from "../utils/handleSignalingEvents.js";

var isLoggedIn = false;
var token = ""; // Agora recommends that you renew a token regularly, such as every hour, in production.
const proxyUrl = "http://localhost:8080/"; // Replace with the proxy server URL

let options = {
  // Set the user ID
  uid: "",
  // Set token expire time: the number of seconds after which this token will expire
  expireTime: 60,
  // The base URL to your token server. For example, https://agora-token-service-production-92ff.up.railway.app".
  serverUrl: "<---- Your token server url ---->",
};

window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  // Signaling Manager will create the engine and channel for you
  const { login, logout } = await SignalingManager(
    showMessage,
    handleSignalingEvents
  );

  // Login with custom UID using token recieved from token generator
  document.getElementById("login").onclick = async function () {
    if (!isLoggedIn) {
      options.uid = document.getElementById("uid").value.toString();
      if (options.uid === "") {
        showMessage("Please enter a User ID.");
        return;
      }
      token = await FetchToken(options);
      await login(options.uid, token);

      isLoggedIn = true;
      document.getElementById("login").innerHTML = "LOGOUT";
    } else {
      await logout();
      isLoggedIn = false;
      document.getElementById("login").innerHTML = "LOGIN";
    }
  };
};

// Fetches the Signaling token
async function FetchToken() {
  return new Promise(function (resolve) {
    axios
      .get(
        proxyUrl +
          options.serverUrl +
          "/rtm/" +
          options.uid +
          "/?expiry=" +
          options.expireTime,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      )
      .then((response) => {
        resolve(response.data.rtmToken);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
