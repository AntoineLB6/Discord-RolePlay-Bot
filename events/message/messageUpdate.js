const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldMessage, newMessage) => {

    const embed = new MessageEmbed()

        .setAuthor({ name: newMessage.author.id, iconURL: newMessage.author.displayAvatarURL() })
        .setDescription(`${newMessage.author} a modifié le message : **${oldMessage.content}** en **${newMessage.content}** (${newMessage.url})`)
        .setTimestamp()
        .setColor("#FF9610");

    client.channels.cache.get(client.serverSettings.messageLogsChannelId).send({ embeds: [embed] });
};