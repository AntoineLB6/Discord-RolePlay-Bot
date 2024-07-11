const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldChannel, newChannel) => {

  if (oldChannel.type === "DM" || newChannel.type === "DM") return;

  const fetchedLogs = await newChannel.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_UPDATE',
  });
  const deletionLog = fetchedLogs.entries.first();

  if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Le channel ${newChannel.name} a été update mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.channelLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

  const { executor, target } = deletionLog;

  const embed = new MessageEmbed()

    .setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
    .setDescription(`${executor} a modifié le channel : **${oldChannel.name}** en **${newChannel.name}** (${target})`)
    .setTimestamp()
    .setColor("#FF9610");

  client.channels.cache.get(client.serverSettings.channelLogsChannelId).send({ embeds: [embed] });
};