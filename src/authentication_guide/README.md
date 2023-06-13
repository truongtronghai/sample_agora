# Secure authentication with tokens

Authentication is the act of validating the identity of each user before they access your system. Agora uses digital tokens to authenticate users and their privileges before they access an Agora service, such as joining an Agora call, or logging into the Signaling system.

This document shows you how to create a Signaling token server and a Signaling client app. The Signaling client app retrieves a Signaling token from the Signaling token server. This token authenticates the current user when the user accesses Signaling.

## Understand the tech

A Signaling token is a dynamic key generated on your app server that is valid for 24 hours. When your users log in to Signaling from your app client, Signaling validates the token and reads the user and project information stored in the token. a Signaling token contains the following information:

- The App ID of your Agora project
- The App Certificate of your Agora project
- The Signaling user ID of the user to be authenticated
- The Unix timestamp when the token expires

# Run the Authentication project

1. **Add your token server URL**

    Create your token generator server from this [guide](https://docs.agora.io/en/signaling/develop/authentication-workflow?platform=web). Add the URL of the server to `options.serverUrl` in `/src/authentication_guide/authentication_guide.js`.

2. **Run the sample projects application**
    
    Start the smaple projects app from the [README](/README.md). In the browser, choose `Authentication Guide` from the dropdown on `http://localhost:9000/`.

3. **Run the proxy server**
    
    For security reasons, browsers restrict cross-origin HTTP requests initiated from scripts. Hence, for your web app to make a request to your token server, we use a NodeJS proxy which adds CORS headers to the proxied requests. You can take a look at the code in `proxy.js`.
    
    To run the proxy, open a new terminal in the `/src/authentication_guide/` directory of this project and run the following command:

    ```bash
    node proxy
    ```

4. In the browser, you should now be at `http://localhost:9000/authentication_guide`. Input the `uid` (User ID) you wish to use in the text field.

5. Click `Login`. The app will fetch a fresh Signaling token from your token server and use it for login.

6. Click `Logout` to end the session.

## Full Documentation

[Agora's full authentication guide](https://docs.agora.io/en/signaling/develop/authentication-workflow?platform=web)
