# Agora Video SDK for Web reference app

This app demonstrates use of [Agora's Video SDK](https://docs.agora.io/en/video-calling/get-started/get-started-sdk) for real-time audio and video communication. It is a robust and comprehensive documentation reference app for Android, designed to enhance your productivity and understanding. It's built to be flexible, easily extensible, and beginner-friendly.

Clone the repo, run and test the samples, and use the code in your own project. Enjoy.

- [Samples](#samples)
- [Prerequisites](#prerequisites)
- [Run this project](#run-this-project)
- [Contact](#contact)


## Samples  

The runnable code examples are:

- [SDK quickstart](./src/sdk_quickstart/) - the minimum code you need to integrate low-latency, high-concurrency
  video calling features into your app using Video SDK.
- [Secure authentication with tokens](./src/secure_authentication/) - quickly set up an authentication token 
  server, retrieve a token from the server, and use it to connect securely to Video SDK channel.
- [Call quality best practice](./src/call_quality/) - ensure optimal audio and video quality in your game.

## Prerequisites

Before getting started with this reference app, ensure you have the following set up:

- A [supported browser](../reference/supported-platforms#browsers).
- Physical media input devices, such as a camera and a microphone.
- A JavaScript package manager such as [npm](https://www.npmjs.com/package/npm).


## Run this project

To run the sample projects in this folder, take the following steps:

1. **Clone the repository**

    To clone the repository to your local machine, open Terminal and navigate to the directory where you want to clone the repository. Then, use the following command:

    ```bash
    git clone https://github.com/AgoraIO/signaling-sdk-samples-web.git
    ```

1. **Install the dependencies** 

    Open Terminal in the root directory of this project and run the following command:

    ```bash
    npm install
    ```
 
1. **Modify the project configuration**

   The app loads connection parameters from [`./src/agora_manager/config.json`](./src/agora_manager/config.json)
   . Ensure that the file is populated with the required parameter values before running the application.

    - `uid`: The user ID associated with the application.
    - `appId`: (Required) The unique ID for the application obtained from [Agora Console](https://console.agora.io). 
    - `channelName`: The default name of the channel to join.
    - `rtcToken`:An token generated for `channelName`. You generate a temporary token using the [Agora token builder](https://agora-token-generator-demo.vercel.app/).
    - `serverUrl`: The URL for the token generator. See [Secure authentication with tokens](authentication-workflow) for information on how to set up a token server.
    - `tokenExpiryTime`: The time in seconds after which a token expires.

    If a valid `serverUrl` is provided, all samples use the token server to obtain a token except the **SDK quickstart** project that uses the `rtcToken`. If a `serverUrl` is not specified, all samples except **Secure authentication with tokens** use the `rtcToken` from `config.json`.

1. **Build and run the project**

   In the project folder, open Terminal and run the following command:

    ``` bash
    npm run build
    npm run start:dev
    ```

    You open the project at `http://localhost:9000/`.

1. **Run the samples in the reference app**

   Choose a sample code from the dropdown that you wish to execute.

## Contact

If you have any questions, issues, or suggestions, please file an issue in our [GitHub Issue Tracker](https://github.com/AgoraIO/video-sdk-samples-js/issues).
