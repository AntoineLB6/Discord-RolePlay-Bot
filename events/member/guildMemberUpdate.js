const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldMember, newMember) => {

	const fetchedLogs = await newMember.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_UPDATE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`${newMember.name} a changé de pseudo mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.memberLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, changes } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} (${executor.id}) a modifié son pseudo : **${changes[0].old}** pour **${changes[0].new}**`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.cache.get(client.serverSettings.memberLogsChannelId).send({ embeds: [embed] });
};