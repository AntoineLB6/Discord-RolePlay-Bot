const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldPresence, newPresence) => {
    try {
        let oldStatus = oldPresence.activities[0] ? oldPresence.activities[0].toString() : "null";
        let newStatus = newPresence.activities[0] ? newPresence.activities[0].toString() : "null";
    
        if (oldPresence.activities[0].type === "CUSTOM") oldStatus = `:${oldPresence.activities[0].emoji.name}: ${oldPresence.activities[0].state}`;
        if (newPresence.activities[0].type === "CUSTOM") newStatus = `:${newPresence.activities[0].emoji.name}: ${newPresence.activities[0].state}`;
    
        const embed = new MessageEmbed()
    
                .setAuthor({ name: newPresence.user.id, iconURL: newPresence.user.displayAvatarURL() })
                .setDescription(`${newPresence.user} a modifié son status : **${oldStatus}** (${oldPresence.status}) en **${newStatus}** (${newPresence.status})`)
                .setTimestamp()
                .setColor("#FF9610");
    
        client.channels.cache.get(client.serverSettings.presenceLogsChannelId).send({ embeds: [embed] });
    } catch (err) {
        const embed = new MessageEmbed()

		.setDescription(`${newPresence.user} a changé son status mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		client.channels.cache.get(client.serverSettings.presenceLogsChannelId).send({ embeds: [embed] });
        client.channels.cache.get(client.serverSettings.errorLogsChannelId).send(`Erreur : ${err}`);
    }

    
};