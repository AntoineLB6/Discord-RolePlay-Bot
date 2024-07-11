const { MESSAGES } = require("../../util/constants");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args, dbUser) => {

    const trainMessage = await message.channel.messages.fetch(message.reference.messageId);
    const trainDbUser = await client.getUser(trainMessage.author);
    if (!trainDbUser) return message.channel.send("**Tu ne peux pas faire cette commande à quelqu'un qui n'a pas de fiche Roleplay !**");
    if (!trainDbUser.trains.daily) return message.channel.send("**Tu as déjà fait ton entrainement aujourd'hui !**");
    if (trainDbUser.trains.weekly < 1) return message.channel.send("**Il ne te reste plus d'entrainement !**");
    if (message.type !== "REPLY") return message.reply("Il faut répondre à l'entraînement du joueur RP !")
    message.delete();


    if (trainMessage.author === message.author) return message.channel.send("**Tu ne peux pas valider ton propre entrainement !**");

    const confirmation_embed = new MessageEmbed()
        .setDescription(`**Veux-tu vraiment valider l'entraînement de ${trainMessage.author} !**`)
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


    const interactionfilter = i => i.user.id === message.author.id;
    const msgToModify = await message.channel.send({ embeds: [confirmation_embed], components: [row] });
    try {
    collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, time: 120000, errors: ["time"] })
    const confirmation = collectorValue.customId;
    if (confirmation === "non") return message.channel.send("**La commande a été annulée !**");

    const ptsXP = Math.floor(Math.random() * 20) + 1;

    const entrainement_embed = new MessageEmbed()
        .setAuthor({ name: `Entrainement de ${trainMessage.author.tag}` })
        .setDescription(`${trainMessage.author} vient de s'entraîner et a gagné **${ptsXP}** points d'entraînements.\n\nhttps://discord.com/channels/935162924681560094/${message.reference.channelId}/${message.reference.messageId}`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor("GREEN")
        .setTimestamp();

    await collectorValue.update({ embeds: [entrainement_embed], components: [] }).catch(() => client.channels.cache.get(client.serverSettings.errorLogsChannelId).send({ content: `Je n'ai pas pu modifier le message d'entrainement de ${trainMessage.author}.` }));

    await client.addXP(trainMessage.author, ptsXP);
    await client.updateUser(trainMessage.author, { "trains.daily": "false" });
    await client.updateUser(trainMessage.author, { "trains.weekly": trainDbUser.trains.weekly - 1 });

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} vient de valider un entrainement de ${trainMessage.author} qui a gagné ${ptsXP} XP !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }

};

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.VERIF_TRAIN;
