const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    if (!dbUser) return message.channel.send("**Tu ne peux pas faire cette commande tant que tu n'as pas de fiche Roleplay !**");
    if (dbUser.inventory.length >= 7) return message.channel.send("**Tu as atteint le nombre maximal d'objet dans ton inventaire.");
    
    const items = [];
    const shop = dbGuild.shop;
    const q = args.join(" ");
    const position = shop.map(e => e.name.toLowerCase()).indexOf(q.toLowerCase());
    const item = shop[position];
    if (!q) return message.channel.send("Il faut selectionner un objet à acheter !");
    if (q && item.prix === 0) return message.channel.send("Cet objet n'est pas achetable !");
    if (q && position == -1) return message.channel.send("Cet objet n'existe pas, vérifiez si l'objet se trouve bien dans le magasin !");
    if (dbUser.balance < item.prix) return message.channel.send("Tu n'as pas assez d'argent !");
    
        try {
            message.channel.send(`Voulez-vous acheter **${item.name}** pour **${item.prix}** <:Joyau:838158853832835153> ? (\`oui\` pour valider)`)
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages(filter, {
                max: 1, time: 10000, errors: ["time"]
            });
            if (userEntry.first().content.toLowerCase() === "oui") {
                client.removeBalance(message.member, item.prix);
                message.channel.send(`Merci pour votre achat, votre balance est maintenant de: \`${dbUser.balance - item.prix}\` <:Joyau:838158853832835153>`);
                const userInventory = dbUser.inventory;
                userInventory.push(item.name);
                client.updateUser(message.author, { inventory: userInventory });
                await client.reloadStatus(message.author);

                const status_logs_embed = new MessageEmbed()
                    .setDescription(`**Le status de ${message.author} a été actualisé !**`)
                    .setColor("#26D6FF");
                client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });
            }
        } catch (e) {
            message.channel.send("Achat annulé, la vérification n'a pas eu lieu.")
        }
   

}

module.exports.help = MESSAGES.COMMANDS.ECONOMY.BUYITEM;