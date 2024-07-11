const { MESSAGES } = require("../../util/constants");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {

    if (message.type !== "REPLY") return message.reply("Il faut répondre à ton entrainement.")
    const trainMessage = await message.channel.messages.fetch(message.reference.messageId)
    if (trainMessage.author !== message.author) return message.channel.send("**Ceci n'est pas ton message !**");

    const entrainement_embed = new MessageEmbed()
        .setAuthor({ name: `Entrainement` })
        .setDescription(`${message.author} vient de faire une requête d'entraînement\n\nhttps://discord.com/channels/935162924681560094/${message.reference.channelId}/${message.reference.messageId}`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor("GREEN")
        .setTimestamp()

        message.channel.send({ content: `<@&${client.serverSettings.staffRoleId}>`, embeds: [entrainement_embed] });
};

module.exports.help = MESSAGES.COMMANDS.RP.ENTRAINEMENT;
