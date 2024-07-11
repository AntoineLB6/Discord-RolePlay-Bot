const { MESSAGES } = require("../../util/constants");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    const shop = dbGuild.shop;
    const q = args.join(" ");
    const position = shop.map(e => e.name.toLowerCase()).indexOf(q.toLowerCase());
    if (!q) return message.channel.send("Il faut selectionner un objet à acheter !");
    if (q && position == -1) return message.channel.send("Cet objet n'existe pas, vérifiez si l'objet se trouve bien dans le magasin !");

    const confirmation_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("**Etes vous sûr de vouloir supprimer ???? !**")
        .setColor("#FF0000");

    const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('oui')
                .setLabel('CONFIRMER')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('non')
                .setLabel('ANNULER')
                .setStyle('DANGER'),
        );

    const msgToModify = await message.channel.send({ embeds: [confirmation_embed], components: [row] });
    const interactionfilter = i => i.user.id === message.author.id;
    try {
        interaction = await msgToModify.awaitMessageComponent({ filter: interactionfilter, componentType: 'BUTTON', time: 120000 });
        const confirmation = interaction.customId;
    if (confirmation === "non") return message.channel.send("**La commande a été annulée !**");
    } catch (err) {
        return message.channel.send("**Condition non remplies, commande annulée !**");
    }

    await shop.splice(position, 1);
    await client.updateGuild({ shop });

    const sucess_embed = new MessageEmbed()

        .setAuthor({ name: `Objet supprimé avec succès.` })
        .setColor("#62EA50");
    await interaction.update({ embeds: [sucess_embed], components: [] });

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a supprimé ${q} du shop !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.shopLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.DELETE_ITEM;