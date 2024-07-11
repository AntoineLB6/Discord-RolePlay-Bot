const { MESSAGES } = require("../../util/constants");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, dbUser) => {
    
    const user = message.mentions.members.first();
    if (!user || !args[1]) return message.channel.send("Tu dois mentionner la personne à qui tu sougaites ajouter l'item ainsi que le nom de l'item.");
    const pingDbUser = await client.getUser(user);
    if (!pingDbUser) return message.channel.send("**Ce joueur n'a pas de base de données !**");
    const userItems = pingDbUser.inventory;
    const q = args.splice(1).join(" ");
    const userItemsPosition = userItems.indexOf(q);
    if (userItemsPosition == -1) return message.channel.send("**Il n'a pas cet objet ! (Tu l'as peut-être mal écrit.)**")
    else {
        try {
            message.channel.send(`Voulez-vous retiré **${q}** de l'inventaire de **${user.user.tag}** ? (\`oui\` pour valider)`)
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages({
                filter, max: 1, time: 10000, errors: ["time"]
            });
            if (userEntry.first().content.toLowerCase() === "oui") {
                message.channel.send(`Vous avez retiré **${q}** à **${user.user.tag}** avec succès.`);
                userItems.splice(userItemsPosition, 1);
                await client.updateUser(user, { inventory: userItems });
                await client.reloadStatus(user);

                const status_logs_embed = new MessageEmbed()
                    .setDescription(`**Le status de ${user} a été actualisé !**`)
                    .setColor("#26D6FF");
                client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });
            } else return message.channel.send("La commande a été annulée.");
        } catch (e) {
            message.channel.send("Achat annulé, la vérification n'a pas eu lieu.")
        }
    }

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a retiré ${q} de l'inventaire de ${user} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.shopLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.TAKEITEM;