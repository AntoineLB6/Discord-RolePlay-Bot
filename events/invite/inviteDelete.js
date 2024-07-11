const { MessageEmbed } = require("discord.js");

module.exports = async (client, invite) => {
    client.invites.get(invite.guild.id).delete(invite.code, invite.uses);

	const fetchedLogs = await invite.guild.fetchAuditLogs({
		limit: 1,
		type: 'INVITE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`L'invite ${invite.code} a été créé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.inviteLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a créé l'invitation : **${target.code}** après qu'lle ait été utilisé ${target.uses} fois.`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.inviteLogsChannelId).then(c => c.send({ embeds: [embed] }));
};