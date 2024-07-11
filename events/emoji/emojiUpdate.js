const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldEmoji, newEmoji) => {

	const fetchedLogs = await newEmoji.guild.fetchAuditLogs({
		limit: 1,
		type: 'EMOJI_UPDATE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`L'emoji ${newEmoji.name} a été update mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.emojiLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a modifié l'emoji : **${oldEmoji.name}** en **${newEmoji.name}** (${target})`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.cache.get(client.serverSettings.emojiLogsChannelId).send({ embeds: [embed] });
};