const { MESSAGES } = require("../../util/constants");

module.exports.run = (client, message, args) => {
    const targetChannel = message.mentions.channels.first()
    if (!targetChannel) {
        message.reply("Veuillez préciser le channel dans lequel vous voulez envoyer l'embed.")
    }

    args.shift()
    const json = JSON.parse(args.join(" "))

    targetChannel.send(json)
};

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.JSONEMBED;
