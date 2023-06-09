# Agora Signaling SDK for Web sample projects

This repository holds the code examples used for the [Agora Signaling SDK for Web](https://docs.agora.io/en/signaling/get-started/get-started-sdk?platform=web) documentation. Clone the repo, run and test the samples, use the code in your own project. Enjoy.

## Samples  

The runnable code examples are:

- [SDK quickstart](/src/sdk_quickstart/) - The minimum code you need to integrate low-latency, high-concurrency signaling features into your app using Signaling SDK.

## Run this project

To run the sample projects in this folder, take the following steps:

1. Clone the Git repository by executing the following command in a terminal window:

    ```bash
    git clone https://github.com/AgoraIO/signaling-sdk-samples-web.git
    ```

1. Install the dependencies. Open Terminal in the root directory of this project and run the following command:

    ```bash
    npm install
    ```
1. Generate a temporary authentication token. 
   Each Signaling token is specific for a userID and channel. 

1. In `src/sdk_quickstart/get_started.js`, replace `appId`, `channelName`, and `token` with your app ID, channel name, and authentication token.


1. Open a command prompt in the project folder, and run the following command:

    ``` bash
    npm run build
    npm run start:dev
    ```

    Open the project at `http://localhost:9000/`.

1. Select an item from the dropdown and test the sample codes.
