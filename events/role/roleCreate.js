const { MessageEmbed } = require("discord.js");

module.exports = async (client, role) => {

	const fetchedLogs = await role.guild.fetchAuditLogs({
		limit: 1,
		type: 'ROLE_CREATE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Le rôle ${role.name} a été créé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.roleLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a créé le role : **${target.name}** (${target.id})`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.roleLogsChannelId).then(c => c.send({ embeds: [embed] }));
};