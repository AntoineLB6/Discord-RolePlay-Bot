const { MessageEmbed } = require("discord.js");

module.exports = async (client, messageReaction, user) => {

    const embed = new MessageEmbed()

        .setAuthor({ name: user.id, iconURL: user.displayAvatarURL() })
        .setDescription(`${user} a retiré sa réaction au message **${messageReaction.message.id}** (${messageReaction.message.url}) avec l'emote ${messageReaction.emoji.name} (${messageReaction.emoji})`)
        .setTimestamp()
        .setColor("#FF9610");

    client.channels.fetch(client.serverSettings.reactionLogsChannelId).then(c => c.send({ embeds: [embed] }));
};