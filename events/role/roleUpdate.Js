const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldRole, newRole) => {

    const fetchedLogs = await newRole.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_UPDATE',
    });
    const deletionLog = fetchedLogs.entries.first();

    if (!deletionLog) {
		const embed = new MessageEmbed()

		.setDescription(`Le Role ${newRole.name} a été update mais je n'ai pas pu retrouver les informations des logs.`)
		.setTimestamp()
		.setColor("#FF9610");
		return client.channels.fetch(client.serverSettings.roleLogsChannelId).then(c => c.send({ embeds: [embed] }));
	}

    const { executor, target } = deletionLog;

    const embed = new MessageEmbed()

        .setAuthor({ name: executor.id, iconURL: executor.displayAvatarURL() })
        .setDescription(`${executor} a modifié le role : **${oldRole.name}** en **${newRole.name}** (${target})`)
        .setTimestamp()
        .setColor("#FF9610");

    client.channels.cache.get(client.serverSettings.roleLogsChannelId).send({ embeds: [embed] });
};