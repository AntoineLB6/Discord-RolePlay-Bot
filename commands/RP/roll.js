const { MESSAGES } = require("../../util/constants");
const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const count = args[0];
    if (isNaN(count)) return message.channel.send("Ceci n'est pas un chiffre.");
    const number = Math.floor(Math.random() * count) + 1;

    const roll_embed = new Discord.MessageEmbed()
        .setAuthor({ name: `Roll de ${message.author.tag}` })
        .setDescription(`${message.author} **A roll :**\n🎲 **${number}** sur \`${count}\``)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor("BLUE")
        .setTimestamp()
        .setFooter({ text: `${message.author.id}` });
    message.channel.send({ embeds: [roll_embed] });
};

module.exports.help = MESSAGES.COMMANDS.RP.ROLL;
