# Connect throught restricted networks using cloud proxy

To accommodate your end users’ firewall settings and business needs, Cloud Proxy offers the following operating modes:

-   **Automatic** (Default mode)

    By default, Video SDK first attempts a direct connection to Agora SD-RTN™. If the attempt fails, Video SDK automatically falls back and sends media securely on TLS 443. This is best practice when you are not sure if your end users are behind a firewall. While transmitting media over TLS 443 may not provide as high quality as using UDP. a connection on TLS 443 works through most firewalls. This is the default behavior of Video SDK when cloud proxy type is set to `NONE` (default); you don't need to write any code to enable it.

-   **Force UDP**

    In the Force UDP mode of Cloud Proxy, Video SDK securely sends media over UDP only. Your end users’ firewall must be configured to trust a list of [allowed IP address](https://docs.agora.io/en/video-calling/reference/cloud-proxy-allowed-ips?platform=web).
    This is best practice when your end users are behind a firewall and require media with the highest possible quality. This mode does not support pushing streams to the CDN or relaying streams across channels.

-   **Force TCP**

    In the Force TCP mode of Cloud Proxy, Video SDK securely sends media over TLS 443 only. This is best practice when your end users are behind a firewall and the firewall’s security policies only allow media to flow through
    TLS 443. In some cases the firewall might trust any traffic over TLS 443. However, in many cases the firewall is configured to trust only a specific range of IP addresses sending traffic over TLS 443. In this case, your end user’s firewall must be
    configured to trust a list of [allowed IP address](https://docs.agora.io/en/video-calling/reference/cloud-proxy-allowed-ips?platform=web). Media quality might be impacted if network conditions degrade.

This app connects to Agora SD-RTN™ using forced UDP mode through a proxy server.

## Understand the code

For context on this sample, and a full explanation of the essential code snippets used in this project, read [Connect through restricted networks with Cloud Proxy](https://docs.agora.io/en/video-calling/develop/cloud-proxy?platform=web)


## How to run this project

To see how to run this project, read the instructions in the main [README](../../README.md) or [SDK quickstart](https://docs-beta.agora.io/en/video-calling/get-started/get-started-sdk).


