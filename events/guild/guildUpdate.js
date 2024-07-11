const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldGuild, newGuild) => {

    const fetchedLogs = await newGuild.fetchAuditLogs({
		limit: 1,
		type: 'GUILD_UPDATE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Le serveur ${newGuild} a été update mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.guildLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, changes } = deletionLog;

	const embed = new MessageEmbed()

            .setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
            .setDescription(`${executor} a modifié le nom du serveur : **${changes[0].old}** pour **${changes[0].new}**`)
            .setTimestamp()
            .setColor("#FF9610");

    client.channels.cache.get(client.serverSettings.guildLogsChannelId).send({ embeds: [embed] });
};