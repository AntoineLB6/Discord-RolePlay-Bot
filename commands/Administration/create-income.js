const { MESSAGES } = require("../../util/constants");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    let income = {
        role: "",
        montant: 0
    }

    let info_embed = new MessageEmbed()

        .setAuthor({ name: `Création de salaire` })
        .addFields([
            { name: "Rôle", value: income.role ? income.role : "Aucun", inline: false },
            { name: "Montant", value: income.montant ? income.montant : "Aucun", inline: false }
        ])
        .setColor("#00B8FF");

    const value_embed = new MessageEmbed()

        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**Quelle est la valeur que vous souhaitez mettre ?**`)
        .setColor("#FF10AF");

    const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('role')
                .setEmoji('㊙️')
                .setLabel('Rôle')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('montant')
                .setEmoji('💰')
                .setLabel('Montant')
                .setStyle('PRIMARY'),
        );
    const row2 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('finish')
                .setEmoji('🔚')
                .setLabel('Finir')
                .setStyle('PRIMARY'),
        );

    const IpMessage = await message.channel.send({ embeds: [info_embed], components: [row, row2] });

    const interactionfilter = i => {
        return i.user.id === message.author.id;
    };
    const filter = m => m.author.id === message.author.id;

    const collector = await IpMessage.createMessageComponentCollector({
        filter: interactionfilter,
        time: 300000,
    });

    collector.on("collect", async (i) => {
        await i.deferUpdate();
        let confirmationInteraction;
        switch (i.customId) {
            case "role": {
                await i.editReply({ embeds: [value_embed], components: [] });
                let verif = true;
                while (verif) {
                    try {
                        const collectorValue = await i.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["time"] })
                        let roleMsg = collectorValue.first();
                        if (!roleMsg.id) return message.channel.send("Commande annulée.")
                        else if (!roleMsg.mentions.roles.first()) message.channel.send("Ceci n'est pas un rôle.").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            income.role = roleMsg.mentions.roles.first().id;
                            verif = false
                        }
                        if (roleMsg.deletable) roleMsg.delete();
                    } catch (err) {
                        message.channel.send("**Condition non remplies, commande annulée !**");
                        info_embed = new MessageEmbed()

                            .setAuthor({ name: `Création de salaire` })
                            .addFields([
                                { name: "Rôle", value: income.role ? income.role : "Aucun", inline: false },
                                { name: "Montant", value: income.montant ? income.montant : "Aucun", inline: false }
                            ])
                            .setColor("#00B8FF");
                        return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                    }
                }

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création de salaire` })
                    .addFields([
                        { name: "Rôle", value: income.role ? income.role : "Aucun", inline: false },
                        { name: "Montant", value: income.montant ? income.montant : "Aucun", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "montant": {
                await i.editReply({ embeds: [value_embed], components: [] });
                let verif = true;
                while (verif) {
                    try {
                        const collectorValue = await i.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["time"] })
                        if (!collectorValue.first().content) return message.channel.send("Commande annulée.")
                        else if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            income.montant = collectorValue.first().content;
                            verif = false
                        }
                        if (collectorValue.first().deletable) collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Condition non remplies, commande annulée !**");
                        info_embed = new MessageEmbed()

                            .setAuthor({ name: `Création de salaire` })
                            .addFields([
                                { name: "Rôle", value: income.role ? income.role : "Aucun", inline: false },
                                { name: "Montant", value: income.montant ? income.montant : "Aucun", inline: false }
                            ])
                            .setColor("#00B8FF");
                        return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                    }
                }

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création de salaire` })
                    .addFields([
                        { name: "Rôle", value: income.role ? income.role : "Aucun", inline: false },
                        { name: "Montant", value: income.montant ? income.montant : "Aucun", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "finish": {
                if (!income.role || !income.montant) {
                    info_embed.addField(":warning: Erreur !", "**Un des champs n'est pas rempli correctment.**")
                    return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                }

                const incomeList = dbGuild.incomes;
                await incomeList.push(income);
                await client.updateGuild({ incomes: incomeList });

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Salaire créé avec succès` })
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [] });
                break;
            }
        }
        await collector.resetTimer();
    });

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a créé un salaire pour <@&${income.role}> !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.economyLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.CREATE_INCOME;