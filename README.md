# EarnApp earnings watcher

[![axios](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/earnapp-earnings-watcher/axios)](https://www.npmjs.com/package/axios) [![earnapp-earnings-watcher](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/earnapp-earnings-watcher/earnapp.js)](https://www.npmjs.com/package/earnapp.js) [![simple-discord-webhooks](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/earnapp-earnings-watcher/simple-discord-webhooks)](https://www.npmjs.com/package/simple-discord-webhooks)

[![GitHub stars](https://img.shields.io/github/stars/LockBlock-dev/earnapp-earnings-watcher.svg)](https://github.com/LockBlock-dev/earnapp-earnings-watcher/stargazers)

Send a report of your hourly earning in a channel via a Discord webhook

![](preview.jpg)

## Installation

-   Install [NodeJS](https://nodejs.org).
-   Download or clone the project.
-   Go to the `earnapp-earnings-watcher` folder and run `npm install`.
-   In the [index.js](./index.js), you need to edit 3 things:

```js
const postman = new Webhook("WEBHOOK URL");
//Add your own Discord WebHook URL
```

```js
client.login({
    authMethod: "google",
    oauthRefreshToken: "COOKIE", //see https://github.com/LockBlock-dev/earnapp.js#how-to-login-with-cookies
});
//Add your own EarnApp cookie
```

```js
const getName = (uuid) => {
    switch (uuid) {
        case "sdk-XXX-XXX":
            return "cool pc";
        case "sdk-XXX-XXX":
            return "my cool VPS";
        default:
            return uuid;
    }
};
//Add a case "uuid" + return "device name" for each device you want to name
```

-   Run `node index.js` or `npm start`.

## Credits

[EarnApp](https://earnapp.com)

## Copyright

See the [license](/LICENSE)
