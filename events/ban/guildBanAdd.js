const { MessageEmbed } = require("discord.js");

module.exports = async (client, ban) => {

	const fetchedLogs = await ban.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setAuthor({ name: ban.user.id, iconURL: ban.user.displayAvatarURL() })
		.setDescription(`${ban.user} a été banni mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.banLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target, reason } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a banni **${target.tag}** (${target}) avec la raison : *${reason}*`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.banLogsChannelId).then(c => c.send({ embeds: [embed] }));
};