const { MESSAGES } = require("../../util/constants");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    const incomeList = dbGuild.incomes;
    const income = message.mentions.roles.first();
    const q = income.id;
    const position = incomeList.map(e => e.role).indexOf(q);
    if (!q) return message.channel.send("Il faut indiquer le rôle !");
    if (q && position == -1) return message.channel.send("Ce rôle n'a pas de salaire.");

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

    await incomeList.splice(position, 1)
    await client.updateGuild({ incomes: incomeList });

    const sucess_embed = new MessageEmbed()

        .setAuthor({ name: `Salaire supprimé avec succès.` })
        .setColor("#62EA50");
    await interaction.update({ embeds: [sucess_embed], components: [] });

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a supprimé le salaire de ${q} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.economyLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.DELETE_INCOME;