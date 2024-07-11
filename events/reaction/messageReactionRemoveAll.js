const { MessageEmbed } = require("discord.js");

module.exports = async (client, message, reactions) => {

    let embed = new MessageEmbed()

        .setDescription(`Quelqu'un a supprimé les réaction du message **${message.id}** (${message.url})\nListe des réactions :`)
        .setTimestamp()
        .setColor("#FF9610");
    for (reaction of reactions) {
        embed.addField(reaction[0], `${reaction[1].count} réaction(s)`, true)
    }

    client.channels.fetch(client.serverSettings.reactionLogsChannelId).then(c => c.send({ embeds: [embed] }));
};