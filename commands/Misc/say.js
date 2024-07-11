const { MessageEmbed } = require("discord.js");
const { MESSAGES } = require("../../util/constants");

module.exports.run = (client, message, args) => {
    const embed = new MessageEmbed()

        .setDescription(args.toString())
        .setColor("FFFFFF");

    message.channel.send({ embeds: [embed] });
};

module.exports.help = MESSAGES.COMMANDS.MISC.SAY;
