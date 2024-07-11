const { MessageEmbed } = require("discord.js");

module.exports = async (client, channel) => {

	const fetchedLogs = await channel.guild.fetchAuditLogs({
		limit: 1,
		type: 'CHANNEL_CREATE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Le channel ${channel.name} a été créé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.channelLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a créé le channel : **${target.name}** (${target})`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.channelLogsChannelId).then(c => c.send({ embeds: [embed] }));
};