const fs = require("fs");
const { Client } = require("earnapp.js");
const { Webhook } = require("simple-discord-webhooks");
const config = require("./config.js");

const client = new Client();
const postman = new Webhook(config.discordWebhookURL);

client.login({
    authMethod: config.authMethod,
    oauthRefreshToken: config.oauthRefreshToken,
});

const delay = async (ms) => {
    return await new Promise((resolve) => setTimeout(resolve, ms));
};

const bytesToSize = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
};

const getOld = () => {
    return JSON.parse(fs.readFileSync("./old.json", "utf8"));
};

const getEarnings = async () => {
    const earnings = [];
    const old = getOld();
    const data = await await client.devices();
    data.forEach((device, i) => {
        if (device.total_bw > 0.0) {
            earnings.push({
                name: device.uuid,
                usage: `+ ${bytesToSize(device.bw - (old[i]?.bw ?? 0))}`,
                amount: `+ ${(device.earned - (old[i]?.earned ?? 0)).toFixed(2)}$`,
            });
        }
    });
    fs.writeFileSync("./old.json", JSON.stringify(data, null, 1), "utf8");
    return earnings;
};

const run = async () => {
    while (true) {
        let date = new Date();
        if ([...Array(config.delay + 1).keys()].includes(date.getMinutes())) {
            await delay(1000 * 30);
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
        }
        await delay(1000 * 60 * config.delay);
    }
};

run();
