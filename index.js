const login = require("facebook-chat-api");
const fs = require("fs");

data = JSON.parse(fs.readFileSync("data.json", "utf-8"))
deets = JSON.parse(fs.readFileSync("login.json", "utf-8"));

let help = (api, threadID) => {
    api.sendMessage(`Elie is currently at ${data.count} :O`, threadID);
}

var reactType = ":angry:";
var wholesome_memes = fs.readdirSync('wholesome');

var valid_reacts = {':love:':'😍', ':haha:':'😆', ':wow:':'😮', ':sad:':'😢', ':angry:':'😠', ':like:':'👍', ':dislike:':'👎'};

// Create simple echo bot
login({email: deets.email, password: deets.password}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        if (message.body.indexOf("!count") > -1) {
            help(api, message.threadID);
            return;
        }

        if (message.body.indexOf("!echo") > -1) {
            api.sendMessage(message.body.substr(6), message.threadID);
            return;
        }

        if (message.body.indexOf("!wholesome") > -1) {
            var img = Math.round(Math.random() * 179 % (wholesome_memes.length - 1)); 
    
            api.sendMessage({body: "i would be wholesome to elie but no", attachment: fs.createReadStream(__dirname + '/wholesome/' + wholesome_memes[img])}, message.threadID);

            return;
        }

        if (message.body.indexOf("!react") > -1) {
            reactType = message.body.split(' ')[1];
            
            if (!(reactType in valid_reacts)) {
                api.sendMessage("Invalid react provided, angrily defaulting to angry.", message.threadID);
                reactType = ":angry:";

                return;
            }

            api.sendMessage("Switching react to " + valid_reacts[reactType], message.threadID);

            return;
        }

        if (message.senderID == '100008167564917' || message.threadID == "100000052597716") {

            api.setMessageReaction(reactType, message.messageID);

            var body = message.body.toLowerCase();

            var matches = body.match(/hi/g);

            if (!matches) return;

            data.count += matches.length;

            fs.writeFileSync("data.json", JSON.stringify(data))

            return;
        }

    });
});
