const { MessageEmbed } = require("discord.js");

module.exports = async (client, emoji) => {

	const fetchedLogs = await emoji.guild.fetchAuditLogs({
		limit: 1,
		type: 'EMOJI_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`L'emote ${emoji} a été supprimé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.emojiLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

	const { executor, target } = deletionLog;

	const embed = new MessageEmbed()

		.setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
		.setDescription(`${executor} a supprimé l'emoji : **${emoji.name}** (${target.id})`)
		.setTimestamp()
		.setColor("#FF9610");

	client.channels.fetch(client.serverSettings.emojiLogsChannelId).then(c => c.send({ embeds: [embed] }));
};