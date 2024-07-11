const { MessageEmbed } = require("discord.js");

module.exports = async (client, messages) => {

	const fetchedLogs = await messages.first().guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_BULK_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`${messages.size} messages ont été supprimé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.messageLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a supprimé **${messages.size}** messages d'un coup.`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.messageLogsChannelId).then(c => c.send({ embeds: [embed] }));
};