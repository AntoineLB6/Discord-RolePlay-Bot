const { MessageEmbed } = require("discord.js");

module.exports = async (client, channel) => {

  if (channel.type === "DM") return;

  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_DELETE',
  });
  const deletionLog = fetchedLogs.entries.first();

  if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Le channel ${channel.name} a été supprimé mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.channelLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

  const { executor, target } = deletionLog;

  const embed = new MessageEmbed()

    .setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
    .setDescription(`${executor} a supprimé le channel : **${channel.name}** (${target.id})`)
    .setTimestamp()
    .setColor("#FF9610");

  client.channels.cache.get(client.serverSettings.channelLogsChannelId).send({ embeds: [embed] });
};