const { MESSAGES } = require("../../util/constants");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, dbUser) => {

    const user = message.mentions.members.first();
    if (!user || !args[1]) return message.channel.send("Tu dois mentionner la personne à qui tu sougaites ajouter l'item ainsi que le nom de l'item.");
    const pingDbUser = await client.getUser(user);
    if (!pingDbUser) return message.channel.send("**Ce joueur n'a pas de base de données !**");

    const shop = require("../../assets/shop/shop.json");
    const q = args.splice(1).join(" ");
    const position = shop.map(e => e.name.toLowerCase()).indexOf(q.toLowerCase());
    const item = shop[position];
    
    if (q && position == -1) return message.channel.send("Cet objet n'existe pas, vérifiez si l'objet se trouve bien dans le magasin !");
    else {
        try {
            message.channel.send(`Voulez-vous give **${item.name}** à **${user.user.tag}** ? (\`oui\` pour valider)`)
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages({
                filter, max: 1, time: 30000, errors: ["time"]
            });
            if (userEntry.first().content.toLowerCase() === "oui") {
                message.channel.send(`Vous avez give **${q}** à **${user.user.tag}** avec succès.`);
                const userInventory = pingDbUser.inventory;
                userInventory.push(item.name);
                await client.updateUser(user, { inventory: userInventory });
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
        .setDescription(`**${message.author} a ajouté ${q} à l'inventaire de ${user} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.shopLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.GIVEITEM;