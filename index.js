const login = require("facebook-chat-api");
const fs = require("fs");

data = JSON.parse(fs.readFileSync("data.json", "utf-8"))
deets = JSON.parse(fs.readFileSync("login.json", "utf-8"));

let help = (api, threadID) => {
    api.sendMessage(`Elie is currently at ${data.count} :O`, threadID);
}

var reactType = ":angry:";

// Create simple echo bot
login({email: deets.email, password: deets.password}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        if (message.body.indexOf("!count") > -1) {
            help(api, message.threadID);
            return;
        }

        if (message.body.indexOf("!react") > -1) {
            reactType = message.body.split(' ')[1];

            api.sendMessage("Switching react to " + reactType, message.messageID);

            return;
        }

        if (message.senderID == '100008167564917' || message.threadID == "100000052597716") {

            var body = message.body.toLowerCase().split(' ');

            data.count += body.reduce((acc, val) => {
                if (val === "hi") acc++;

                return acc;
            }, 0);

            api.setMessageReaction(reactType, message.messageID);

            fs.writeFileSync("data.json", JSON.stringify(data))

            return;
        }

        //api.sendMessage(message.body, message.threadID);
    });
});