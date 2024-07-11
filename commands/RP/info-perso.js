const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const user = require("../../models/user");

const { MESSAGES } = require("../../util/constants");


exports.run = async (client, message) => {

    let commanduser;
    const pingmember = message.mentions.members.first();
    if (pingmember) {
        commanduser = pingmember;
    } else {
        commanduser = message.member;
    }

    let dbCommandUser = await client.getUser(commanduser);
    if (!dbCommandUser) return message.channel.send("**Ce joueur n'a pas de base de données !**");

    let info_embed = await client.loadInfoPersoInfoEmbed(commanduser);

    const row = {};


    row.main = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('home')
                .setEmoji('🏠')
                .setLabel('Accueil')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('stats')
                .setEmoji('🥋')
                .setLabel('Gestion des Stats')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('economy')
                .setEmoji('💰')
                .setLabel('Economie')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('inventaire')
                .setEmoji('🎎')
                .setLabel('Inventaire')
                .setStyle('SECONDARY'),
        );

    row.infosRow1 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('infoecrit')
                .setEmoji('🙎')
                .setLabel('Afficher les infos écrites')
                .setStyle('SECONDARY'),
        );

    let stats_embed = await client.loadInfoPersoStatEmbed(commanduser);

    row.statsRow1 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('addvitalite')
                .setEmoji('🙎')
                .setLabel('Vitalité')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('addforce')
                .setEmoji('💪')
                .setLabel('Force')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('addresistance')
                .setEmoji('🏔️')
                .setLabel('Résistance')
                .setStyle('SUCCESS'),
        );
    row.statsRow2 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('addagilite')
                .setEmoji('💨')
                .setLabel('Agilité')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('addreserveMagique')
                .setEmoji('🔮')
                .setLabel('Réserve Magique')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('addmaitriseMagique')
                .setEmoji('🪄')
                .setLabel('Maitrise Magique')
                .setStyle('SUCCESS'),
        );

    let economy_embed = await client.loadInfoPersoEconomyEmbed(commanduser);

    row.economyRow1 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('pay')
                .setEmoji('💸')
                .setLabel('Donner Argent')
                .setStyle('SUCCESS'),
        );

    row.inventairePages = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('previous')
                .setEmoji('◀️')
                .setLabel('Page Précédente')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setEmoji('▶️')
                .setLabel('Page Suivante')
                .setStyle('PRIMARY'),
        );

    row.confirmationButtons = new MessageActionRow()
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

        const confirmation_embed = new MessageEmbed()
            .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
            .setDescription(`**Cette action est irrévocable, êtes-vous sûr de votre décision ?**`)
            .setColor("#FF0000");

    let pageNumber = 1;
    const maxPage = await Math.ceil(dbCommandUser.inventory.length / 10);

    const interactionfilter = i => {
        return i.user.id === message.author.id;
    };
    const msgfilter = m => m.author.id === message.author.id;
    const IpMessage = await message.channel.send({ embeds: [info_embed.embed], components: [row.main, row.infosRow1], files: [info_embed.infoPersoImg] });

    const collector = await IpMessage.createMessageComponentCollector({
        filter: interactionfilter,
        time: 300000,
    });

    collector.on("collect", async (i) => {
        await i.deferUpdate();
        switch (i.customId) {
            case "home": {
                info_embed = await client.loadInfoPersoInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed.embed], components: [row.main, row.infosRow1], files: [info_embed.infoPersoImg] });
                break;
            }
            case "infoecrit": {
                info_embed = await client.loadInfoPersoInfoEcritesEmbed(commanduser);
                await i.editReply({ embeds: [info_embed.embed], components: [row.main, row.infosRow1], files: [info_embed.infoPersoImg] });
                break;
            }
            case "economy": {
                economy_embed = await client.loadInfoPersoEconomyEmbed(commanduser);

                if (pingmember) await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                else await i.editReply({ embeds: [economy_embed.embed], components: [row.main, row.economyRow1], files: [economy_embed.economyImg] });
                break;
            }
            case "pay": {
                const ping_embed = new MessageEmbed()
                    .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
                    .setDescription(`**A qui souhaitez vous donner de l'argent ?**\n(Un ping de cette personne est attendu.)`)
                    .setFooter({ text: "Vous pouvez annuler la commande à tout moment en tapant : `.exit`" })
                    .setColor("#FF10AF");
                await i.editReply({ embeds: [ping_embed], components: [], files: [] });

                let collectorValue;
                let confirmationInteraction;
                let verif = true;
                while (verif) {
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                        if (collectorValue.first().content === ".exit") {
                            console.log("a")
                            if (collectorValue.first().deletable) collectorValue.first().delete();
                            await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                            return verif = false;
                        }
                        if (!collectorValue.first().mentions.members.first()) message.channel.send("Ceci n'est pas un ping d'une personne.").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            let pingDbUser;
                            if (collectorValue.first().mentions.members.first()) pingDbUser = await client.getUser(collectorValue.first().mentions.members.first());
                            else pingDbUser = false
                            if (!pingDbUser) message.channel.send("Ce joueur n'a pas de personnage.").then(msg => {
                                setTimeout(() => msg.delete(), 5000)
                            })
                            else verif = false
                        }
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        economy_embed = await client.loadInfoPersoEconomyEmbed(commanduser);
                        return await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                    }
                }
                const userToPay = collectorValue.first().mentions.members.first();
                verif = true;
                const value_embed = await client.loadInfoPersoMoneyEmbed(commanduser)
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    if (!collectorValue) return message.channel.send("**Aucun message n'a été collecté, la commande a été annulée.**");
                    else if (collectorValue.first().content === ".exit") {
                        if (collectorValue.first().deletable) collectorValue.first().delete();
                        await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                        return verif = false;
                    }
                    else if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else if (collectorValue.first().content >= dbCommandUser.stats.balance) message.channel.send("Vous n'avez pas assez d'argent.")
                    else {
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        economy_embed = await client.loadInfoPersoEconomyEmbed(commanduser);
                        return await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                    }
                }
                await i.editReply({ embeds: [confirmation_embed], components: [row.confirmationButtons] });
                try {
                    confirmationInteraction = await i.message.awaitMessageComponent({ filter: interactionfilter, componentType: 'BUTTON', time: 120000 });
                    const confirmation = confirmationInteraction.customId;
                    if (confirmation === "oui") {
                        const pingDbUser = await client.getUser(userToPay);
                        await client.updateUser(commanduser, { "stats.balance": dbCommandUser.stats.balance - collectorValue.first().content });
                        await client.updateUser(userToPay, { "stats.balance": pingDbUser.stats.balance + collectorValue.first().content });
                        await client.reloadStatus(commanduser);

                        const status_logs_embed1 = new MessageEmbed()
                            .setDescription(`**Le status de ${commanduser} a été actualisé !**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed1] });
                    
                        await client.reloadStatus(userToPay);

                        const status_logs_embed2 = new MessageEmbed()
                            .setDescription(`**Le status de ${userToPay} a été actualisé !**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed2] });

                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
                            .setDescription(`**${commanduser.user} a donné ${collectorValue.first().content} :money: à ${userToPay}.**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
                    }
                } catch (err) {
                    message.channel.send("**Erreur détectée !**");
                    economy_embed = await client.loadInfoPersoEconomyEmbed(commanduser);
                    return await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                }

                economy_embed = await client.loadInfoPersoEconomyEmbed(commanduser);
                await i.editReply({ embeds: [economy_embed.embed], components: [row.main], files: [economy_embed.economyImg] });
                break;
            }
            case "stats": {
                stats_embed = await client.loadInfoPersoStatEmbed(commanduser);
                if (dbCommandUser.stats.pointsLeft < 1) {
                    for (component in row.statsRow1.components) {
                        row.statsRow1.components[component].disabled = true;
                    }
                    for (component in row.statsRow2.components) {
                        row.statsRow2.components[component].disabled = true;
                    }
                }
                if (pingmember) await i.editReply({ embeds: [stats_embed], components: [row.main], files: [] });
                else await i.editReply({ embeds: [stats_embed], components: [row.main, row.statsRow1, row.statsRow2], files: [] });
                break;
            }
            case "inventaire": {
                let embed = await client.getInventaire(pageNumber, commanduser)
                if (maxPage <= 1) {
                    for (component in row.inventairePages.components) {
                        row.inventairePages.components[component].disabled = true;
                    }
                }
                await i.editReply({ embeds: [embed], components: [row.main, row.inventairePages], files: [] });
                break;
            }
            case "previous": {
                if (pageNumber <= 1) pageNumber = maxPage;
                else pageNumber -= 1;
                let embed = await client.getInventaire(pageNumber, commanduser);
                if (maxPage <= 1) {
                    for (component in row.inventairePages.components) {
                        row.inventairePages.components[component].disabled = true;
                    }
                }
                await i.editReply({ embeds: [embed], components: [row.main, row.inventairePages] });
                break;
            }
            case "next": {
                if (pageNumber >= maxPage) pageNumber = 1;
                else pageNumber += 1;
                let embed = await client.getInventaire(pageNumber, commanduser);
                if (maxPage <= 1) {
                    for (component in row.inventairePages.components) {
                        row.inventairePages.components[component].disabled = true;
                    }
                }
                await i.editReply({ embeds: [embed], components: [row.main, row.inventairePages] });
                break;
            }
            case "addvitalite": {
                await client.addPointsStats(message, i, commanduser, row, "vitalite");
                break;
            }
            case "addforce": {
                await client.addPointsStats(message, i, commanduser, row, "force");
                break;
            }
            case "addresistance": {
                await client.addPointsStats(message, i, commanduser, row, "resistance");
                break;
            }
            case "addagilite": {
                await client.addPointsStats(message, i, commanduser, row, "agilite");
                break;
            }
            case "addreserveMagique": {
                await client.addPointsStats(message, i, commanduser, row, "reserveMagique");
                break;
            }
            case "addmaitriseMagique": {
                await client.addPointsStats(message, i, commanduser, row, "maitriseMagique");
                break;
            }
        }
        await collector.resetTimer();
    });
};


module.exports.help = MESSAGES.COMMANDS.RP.INFO_PERSO;