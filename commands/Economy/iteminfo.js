const { MessageEmbed } = require("discord.js");
const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    if (!dbUser) return message.channel.send("**Tu ne peux pas faire cette commande tant que tu n'as pas de fiche Roleplay !**");
    
    const shop = dbGuild.shop;
    const q = args.join(" ");
    const position = shop.map(e => e.name.toLowerCase()).indexOf(q.toLowerCase());
    const item = shop[position];
    if (q && position == -1) return message.channel.send("Cet objet n'existe pas, vérifiez si l'objet se trouve bien dans le magasin !");


    const embed = new MessageEmbed()
        .setTitle(`${item.name} (Type: ${item.type})`)
        .setColor("BLUE")
        .setDescription(item.description);

    if (item.prix && item.prix !== 0) embed.addField("Prix :", `${item.prix} <:Joyau:838158853832835153>`, true);

    message.channel.send({ embeds: [embed] });
}

module.exports.help = MESSAGES.COMMANDS.ECONOMY.ITEMINFO;
