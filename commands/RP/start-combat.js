const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    const row = new MessageActionRow();
    const interactionfilter = i => i.user.id === message.author.id;
    const msgfilter = m => m.author.id === message.author.id;
    let collectorValue;
    let verif = true;
    let participants = [];

    const type_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("Quel type de combat êtes vous entrain de commencer ?")
        .setColor("#9400FF");

    row.setComponents(
        new MessageSelectMenu()
            .setCustomId('type')
            .setPlaceholder('Barre de Sélection')
            .addOptions([
                {
                    label: 'Combat en 1 VS 1',
                    value: '1VS1',
                },
                {
                    label: 'Combat de Groupe',
                    value: 'Groupe',
                },
                {
                    label: 'Annuler Commande',
                    value: 'exit',
                },
            ]),
    );

    const msgToModify = await message.channel.send({ embeds: [type_embed], components: [row] });
    try {
        collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000, errors: ["time"] })
        if (collectorValue.values[0] === "exit") return message.channel.send("**La commande a été annulée.**");
        else if (collectorValue.values[0] === "Groupe") {
            while (verif) {
                let participantsString = "";
                if (participants.length === 0) participantsString = "Aucun";
                else participantsString = participants.join(", ");

                const participants_embed = new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .setDescription(`**Veuillez mentionner tous les participants au combat, liste des participants :**\n\n${participantsString}\n\n**Une fois que vous aurez fini votre liste, tapez :** \`.finish\`\nSi vous souhaitez retirer un item de la liste, veuillez rajouter le préfixe \`-\` collé devant la zone existante.**`)
                    .setFooter({ text: "N'oubliez pas de vous ajoutez vous même." })
                    .setColor("#FF3926");
                await msgToModify.edit({ embeds: [participants_embed], components: [] });

                collectorValue = "";
                try {
                    collectorValue = await msgToModify.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    if (collectorValue.first().content === "exit") return message.channel.send("**La commande a été annulée.**");
                    else if (collectorValue.first().content === ".finish") verif = false
                    else if (!collectorValue.first().mentions.members.first()) return message.channel.send("**Merci de bien vouloir ping la personne afin que je puisse l'ajouter au combat.**").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else if (collectorValue.first().content.startsWith("-")) {
                        const q = await item.zones.indexOf(collectorValue.first().content.slice(1));
                        if (q == -1) message.channel.send("Ce joueur ne fait pas parti du combat.")
                        else await item.zones.splice(q, 1);
                    }
                    else participants.push(collectorValue.first().mentions.members.first())
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                }

            }
        }
        else if (collectorValue.values[0] === "1VS1") {
            while (verif) {
                const participants_embed = new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .setDescription(`**Veuillez mentionner la personne contre qui vous vous batez.**`)
                    .setColor("#FF3926");
                await msgToModify.edit({ embeds: [participants_embed], components: [] });

                collectorValue = "";
                try {
                    collectorValue = await msgToModify.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    if (collectorValue.first().content === "exit") return message.channel.send("**La commande a été annulée.**");
                    else if (!collectorValue.first().mentions.members.first()) return message.channel.send("**Merci de bien vouloir ping la personne afin que je puisse l'ajouter au combat.**").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        verif = false
                        participants.push(message.author)
                        participants.push(collectorValue.first().mentions.members.first())
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                }
            }
        }
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }

    const threadChannel = await message.startThread({
        name: `combat-${message.author.username}`,
        reason: 'Combat RP',
    });

    for (participant of participants) {
        await client.reloadStatus(participant);

        const status_logs_embed = new MessageEmbed()
        .setDescription(`**Le status de ${participant} a été actualisé !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });

        message.channel.permissionOverwrites.create(participant.id, {
            SEND_MESSAGES_IN_THREADS: true
        });
    }

    const combat = {
        participants,
        channelID: message.channel.id,
        threadChannelID: threadChannel.id,
        date: new Date()
    }

    const combatList = dbGuild.combats;
    await combatList.push(combat);
    await client.updateGuild({ combats: combatList });

    const final_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("**Votre combat a été créé avec succés !**")
        .setColor("#26D6FF");
    msgToModify.edit({ embeds: [final_embed], components: [] });

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} vient de lancer un combat !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
};

module.exports.help = MESSAGES.COMMANDS.RP.START_COMBAT;