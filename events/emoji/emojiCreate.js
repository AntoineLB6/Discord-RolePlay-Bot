const { MessageEmbed } = require("discord.js");

module.exports = async (client, emoji) => {

	const fetchedLogs = await emoji.guild.fetchAuditLogs({
		limit: 1,
		type: 'EMOJI_CREATE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`L'emote ${emoji} a été créé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.emojiLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a créé l'emoji : **${target.name}** (${target})`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.emojiLogsChannelId).then(c => c.send({ embeds: [embed] }));
};