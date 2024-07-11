const { MESSAGES } = require("../../util/constants");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    
    const user = message.mentions.members.first();
    if (!user || !args[1]) return message.channel.send("Tu dois mentionner la personne à qui tu souhaites ajouter l'argent et le montant donné.");
    const pingDbUser = await client.getUser(user);
    if (!pingDbUser) return message.channel.send("**Ce joueur n'a pas de base de données !**");
    const balanceToAdd = parseInt(args[1]);
    if (isNaN(balanceToAdd)) return message.channel.send("Ceci n'est pas un nombre !");
    if (!pingDbUser.stats.balance) await client.updateUser(user, { "stats.balance": 0 });
    
    await client.addBalance(user, balanceToAdd);
    await client.reloadStatus(commanduser);

    const status_logs_embed = new MessageEmbed()
        .setDescription(`**Le status de ${commanduser} a été actualisé !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });
    
    message.channel.send(`Vous avez ajouté avec succès ${balanceToAdd} <:Joyau:838158853832835153> à utilisateur ${user} !`);

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a ajouté ${balanceToAdd} :moneybag: à ${user} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.economyLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.ADDMONEY;