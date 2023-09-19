# Config

This README provides information about the configuration file [`config.json`](config.json) used in the project. The file contains the following structure:

```json
{
  "uid": "1",
  "appId": "",
  "channelName": "",
  "proxyUrl": "http://localhost:8080/",
  "serverUrl": "",
  "tokenExpiryTime": "600",
  "token": "",
  "encryptionMode": 7,
  "salt": "",
  "cipherKey": "",
  "cloudProxy": true,
}
```

## DocsAppConfig Struct

The `rmtConfig` struct represents the configuration for the application and provides a shared instance of the configuration data. It conforms to the `Codable` protocol for easy serialization and deserialization of JSON data.

### Properties

- `uid`: The user ID associated with the application.
- `appId`: The unique ID for the application obtained from https://console.agora.io.
- `channelName`: The pre-filled text for the channel to join.
- `token`: The Video SDK token generated for authentication.
- `proxyUrl`: The URL of the proxy server to be used.
- `serverUrl`: The URL for the token generator (no trailing slash).
- `tokenExpiryTime`: The expiry time (in seconds) for token generated from the token generator.
- `encryptionMode`: The mode for encryption, ranging from 1 to 8.
- `salt`: The salt used for Video SDK encryption.
- `cipherKey`: The encryption key used for Video SDK encryption.
- `cloudProxy`: Whether to enable cloud proxy.

The configuration data is loaded from the config.json file located in the project bundle.

```js
// Get the config from config.json
import config from "./config.json";

// Accessing the configuration properties
let uid = config.uid;
let appId = config.appId;
let channel = config.channel;
// ... and so on
```

Please ensure that the [`config.json`](config.json) file is correctly populated with the required values before running the application.
