const login = require("facebook-chat-api");
const fs = require("fs");

data = JSON.parse(fs.readFileSync("data.json", "utf-8"))
deets = JSON.parse(fs.readFileSync("login.json", "utf-8"));

let help = () => {
   return `Elie is currently at ${data.count} :O`;
}

var reactType = ":angry:";
var wholesome_memes = fs.readdirSync('wholesome');
var COMMAND_PREFIX = "!";
var valid_reacts = {':love:':'😍', ':haha:':'😆', ':wow:':'😮', ':sad:':'😢', ':angry:':'😠', ':like:':'👍', ':dislike:':'👎'};


var messaging_commands = {
    'count': message => { return help(); },
    'echo': message => { return message; },
    'wholesome': message => {
        var img = Math.round(Math.random() * 179 % (wholesome_memes.length - 1));
        return {
            body: "i would be wholesome to elie but no",
            attachment: fs.createReadStream(__dirname + '/wholesome/' + wholesome_memes[img])
        };
    },
    'react': message => {
        reactType = message.split(' ')[1];
            
        if (!(reactType in valid_reacts)) {
            reactType = ":angry:";
            return "Invalid react provided, angrily defaulting to angry.";
        }
        return "Switching react to " + valid_reacts[reactType];
    }
};

// Create simple echo bot
login({email: deets.email, password: deets.password}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        // text based command, in the form [prefix][command] [message argument (can be empty)]
        if(message.body.indexOf(COMMAND_PREFIX) > -1) {
            var command = message.body.split(' ')[0].substring(COMMAND_PREFIX.length);
            if (!(command in messaging_commands)) {
                // no op, invalid command
            } else {
                api.sendMessage(messaging_commands[command](message.body.substring(command.length + 1)), message.threadID);
            }
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
