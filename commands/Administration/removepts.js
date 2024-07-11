const { MESSAGES } = require("../../util/constants");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {

    const user = message.mentions.members.first();
    if (!user || !args[1]) return message.channel.send("Tu dois mentionner la personne à qui tu souhaites retirer les points et mettre le nombre de points a enlever.");
    const pingDbUser = await client.getUser(user);
    if (!pingDbUser) return message.channel.send("**Ce joueur n'a pas de base de données !**");
    const ptsToRemove = parseInt(args[1], 10);
    if (isNaN(ptsToRemove)) return message.channel.send("Ceci n'est pas un nombre !");
    if (!pingDbUser.stats.pointsLeft) await client.updateUser(user, { "stats.pointsLeft": 0 });

    await client.removePts(user, ptsToRemove);

    message.channel.send(`Vous avez retiré avec succès ${ptsToRemove} points à utilisateur ${user} !`);

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a retiré ${ptsToRemove} points d'entrainement à ${user} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
};

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.REMOVEPTS;
