# Agora Video SDK for Web reference app

This app demonstrates use of [Agora's Video SDK](https://docs.agora.io/en/video-calling/get-started/get-started-sdk) for real-time audio and video communication. It is a robust and comprehensive documentation reference app for Android, designed to enhance your productivity and understanding. It's built to be flexible, easily extensible, and beginner-friendly.

Clone the repo, run and test the samples, and use the code in your own project. Enjoy.

- [Agora Video SDK for Web reference app](#agora-video-sdk-for-web-reference-app)
  - [Samples](#samples)
  - [Prerequisites](#prerequisites)
  - [Run this project](#run-this-project)
  - [Contact](#contact)


## Samples  

The runnable code examples are:

- [SDK quickstart](./src/sdk_quickstart/) - the minimum code you need to integrate low-latency, high-concurrency
  video calling features into your app using Video SDK.
- [Secure authentication with tokens](src/authentication_workflow/) - quickly set up an authentication token server, retrieve a token from the server, and use it to connect securely to Video SDK channel.
- [Call quality best practice](./src/call_quality/) - ensure optimal audio and video quality in your app.
- [Secure channels with encryption](./src/channel_encryption/) - integrate built-in encryption into your app using Video SDK..


## Prerequisites

Before getting started with this reference app, ensure you have the following set up:

- A [supported browser](../reference/supported-platforms#browsers).
- Physical media input devices, such as a camera and a microphone.
- The [pnpm](https://pnpm.io/installation#using-npm) package manager.


## Run this project

To run the sample projects in this folder, take the following steps:

1. **Clone the repository**

    To clone the repository to your local machine, open Terminal and navigate to the directory where you want to clone the repository. Then, use the following command:

    ```bash
    git clone https://github.com/AgoraIO/video-sdk-samples-js.git
    ```

1. **Install the dependencies** 

    Open Terminal in the root directory of this project and run the following command:

    ```bash
    pnpm install
    ```
 
1. **Modify the project configuration**

   The app loads connection parameters from [`./src/agora_manager/config.json`](./src/agora_manager/config.json)
   . If a valid `serverUrl` is provided, all samples use a token server to obtain a token except the **SDK quickstart** project that uses the `rtcToken`. If a `serverUrl` is not specified, all samples except **Secure authentication with tokens** use the `rtcToken` from `config.json`.
 
   Ensure that the file is populated with the required parameter values before running the application.

    - `uid`: The user ID associated with the application.
    - `appId`: (Required) The unique ID for the application obtained from [Agora Console](https://console.agora.io). 
    - `channelName`: The default name of the channel to join.
    - `token`:An token generated for `channelName`. You generate a temporary token using the [Agora token builder](https://agora-token-generator-demo.vercel.app/).
    - `serverUrl`: The URL for the token generator. See [Secure authentication with tokens](authentication-workflow) for information on how to set up a token server.
    - `tokenExpiryTime`: The time in seconds after which a token expires.

2. **Build and run the project**

   In the project folder, open Terminal and run the following command:

    ``` bash
    pnpm dev
    ```

    You open the project at the URL shown in your terminal.

3. **Run the samples in the reference app**

   Choose a sample from the dropdown and test the code.

## Contact

If you have any questions, issues, or suggestions, please file an issue in our [GitHub Issue Tracker](https://github.com/AgoraIO/video-sdk-samples-js/issues).
