const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {

	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Un message de ${message.author} a été supprimé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.messageLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a supprimé le message de **${message.author}** où il était écrit :\n${message.content}`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.messageLogsChannelId).then(c => c.send({ embeds: [embed] }));
};