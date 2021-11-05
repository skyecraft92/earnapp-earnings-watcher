const fs = require("fs");
const { Client } = require("earnapp.js");
const { Webhook } = require("simple-discord-webhooks");

const client = new Client();
const postman = new Webhook("WEBHOOK URL");

client.login({
    authMethod: "google",
    oauthRefreshToken: "COOKIE", //see https://github.com/LockBlock-dev/earnapp.js#how-to-login-with-cookies
});

let first = true;

const delay = async (ms) => {
    return await new Promise((resolve) => setTimeout(resolve, ms));
};

const getName = (uuid) => {
    switch (uuid) {
        case "sdk-XXX-XXX":
            return "cool pc";
        default:
            return uuid;
    }
};

const bytesToSize = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
};

const getDevices = async () => {
    const devices = await client.devices();
    fs.writeFileSync("./old.json", JSON.stringify(devices, null, 1), "utf8");
    return devices;
};

const getEarnings = async () => {
    const earnings = [];
    const old = JSON.parse(fs.readFileSync("./old.json", "utf8"));
    const data = await getDevices();
    data.forEach((device, i) => {
        if (device.total_bw > 0.0) {
            earnings.push({
                name: getName(device.uuid),
                usage: `+ ${bytesToSize(device.bw - old[i].bw)}`,
                amount: `+ ${(device.earned - old[i].earned).toFixed(2)}$`,
            });
        }
    });

    return earnings;
};

const run = async () => {
    while (true) {
        if (first) {
            await getDevices();
            first = false
        }
        const earnings = await getEarnings();
        let fields = [];
        earnings.forEach((e) => {
            fields.push({
                name: e.name,
                value: `${e.usage} | ${e.amount}`,
            });
        });
        postman.send("", [
            {
                title: "EarnApp gains report",
                fields: fields,
            },
        ]);
        await delay(1000 * 60 * 60);
    }
};

run();
