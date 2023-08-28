# Agora Vidoe SDK for Web v4.x reference app

This repository holds the code examples used for the [Agora Video SDK for Web](https://docs.agora.io/en/video-calling/overview/product-overview?platform=web) documentation. Clone the repo, run and test the samples, use the code in your own project. Enjoy.

## Samples  

The runnable code examples are:

- [SDK quickstart](/src/sdk_quickstart/) - the minimum code you need to integrate low-latency, high-concurrency
  video calling features into your app using Video SDK.
- [Secure authentication with tokens](/src/authentication_workflow/) - quickly set up an authentication token server, retrieve
  a token from the server, and use it to connect securely to Video SDK channel.
- [Connect through restricted networks with Cloud Proxy](src/cloud_proxy/) - ensure reliable connectivity for your users when they connect from an
  environment with a restricted network.
- [Data encryption](src/data_encryption) - integrate built-in data encryption into your app using Video SDK.
- [Geofencing](src/geofencing) - only connect to Video SDK within the specified region.


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
1. Generate [temporary authentication tokens](https://webdemo.agora.io/token-builder/). 
   In Video SDK, each token you create for your app is specific to a user ID. To test your app, you need a token for each user in the channel. 

1. In `src/signaling_manager/config.js`, replace `appId`, `channelName`, `uid` and `token` values with your app ID, channel name, and authentication token.


1. Open a command prompt in the project folder, and run the following command:

    ``` bash
    npm run build
    npm run start:dev
    ```

    Open the project at `http://localhost:9000/`.

1. Select an item from the dropdown and test the sample codes.
