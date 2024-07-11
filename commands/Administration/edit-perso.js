const { MESSAGES } = require("../../util/constants");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const isImageUrl = require("is-image-url");

module.exports.run = async (client, message, args, dbUser) => {

    let commanduser;
    const pingmember = message.mentions.members.first();
    if (pingmember) {
        commanduser = pingmember;
    } else {
        commanduser = message.member;
    }

    let dbCommandUser = await client.getUser(commanduser);
    if (!dbCommandUser) return message.channel.send("**Ce joueur n'a pas de base de données !**");

    let main_embed = new MessageEmbed()

        .setDescription(`Profil de ${commanduser}`)
        .addFields([
            { name: "Accéder aux Informations du Personnage", value: "●▬▬๑۩۩๑▬▬▬▬▬▬๑۩۩๑▬▬●", inline: false },
            { name: "Accéder aux Statistiques du Personnage", value: "●▬▬๑۩۩๑▬▬▬▬▬▬๑۩۩๑▬▬●", inline: false },
        ])
        .setColor("#00B8FF");

    let info_embed = await client.loadInfoEmbed(commanduser);
    let stat_embed = await client.loadStatEmbed(commanduser);

    const value_embed = new MessageEmbed()

        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**Quelle est la valeur que vous souhaitez y attribuer ?**`)
        .setColor("#FF10AF");

    const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('home')
                .setEmoji('🏠')
                .setLabel('Accueil')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('infos')
                .setEmoji('🐢')
                .setLabel('Infos')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('stats')
                .setEmoji('🐍')
                .setLabel('Gestion des Stats')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('finish')
                .setEmoji('🔚')
                .setLabel('Finir')
                .setStyle('SECONDARY'),
        );
    const infosRow1 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('editname')
                .setEmoji('🌓')
                .setLabel('Nom')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editage')
                .setEmoji('👦')
                .setLabel('Age')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editsexe')
                .setEmoji('🚹')
                .setLabel('Sexe')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editrace')
                .setEmoji('🧝')
                .setLabel('Race')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editorigine')
                .setEmoji('🗺️')
                .setLabel('Origine')
                .setStyle('SUCCESS'),
        );
    const infosRow2 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('editmagie')
                .setEmoji('🔮')
                .setLabel('Magie')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editrank')
                .setEmoji('☘️')
                .setLabel('Rang Grimoire')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editere')
                .setEmoji('🌌')
                .setLabel('Ere Grimoire')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editcompagnie')
                .setEmoji('🥧')
                .setLabel('Compagnie')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editapparence')
                .setEmoji('🌺')
                .setLabel('Apparence')
                .setStyle('SUCCESS'),
        );

    const statsRow1 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('editvitalite')
                .setEmoji('🙎')
                .setLabel('Vitalité')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editforce')
                .setEmoji('💪')
                .setLabel('Force')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editresistance')
                .setEmoji('🏔️')
                .setLabel('Résistance')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editagilite')
                .setEmoji('💨')
                .setLabel('Agilité')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editreserveMagique')
                .setEmoji('🔮')
                .setLabel('Réserve Magique')
                .setStyle('SUCCESS'),
        );
    const statsRow2 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('editmaitriseMagique')
                .setEmoji('🪄')
                .setLabel('Maitrise Magique')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editpointsLeft')
                .setEmoji('♠️')
                .setLabel('Points Vacants')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editbalance')
                .setEmoji('💰')
                .setLabel('Monnaie')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editxp')
                .setEmoji('💎')
                .setLabel('XP')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editlvl')
                .setEmoji('📈')
                .setLabel('Niveau')
                .setStyle('SUCCESS'),
        );

    const EditMessage = await message.channel.send({ embeds: [main_embed], components: [row] });

    const interactionfilter = i => {
        return i.user.id === message.author.id;
    };
    const msgfilter = m => m.author.id === message.author.id;

    const collector = await EditMessage.createMessageComponentCollector({
        filter: interactionfilter,
        time: 300000,
    });

    collector.on("collect", async (i) => {
        await i.deferUpdate();
        let collectorValue;
        let verif = true;
        switch (i.customId) {
            case "home": {
                await i.editReply({ embeds: [main_embed], components: [row] });
                break;
            }
            case "infos": {
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "stats": {
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editname": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    await client.updateUser(commanduser, { "infosRP.name": collectorValue.first().content });
                    if (collectorValue.first().deletable) await collectorValue.first().delete();

                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("Le nom a été modifié", `**${dbCommandUser.infosRP.name}** en **${collectorValue.first().content}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }

                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editage": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                        if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            await client.updateUser(commanduser, { "infosRP.age": collectorValue.first().content });

                            const logs_embed = new MessageEmbed()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                                .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                                .addField("L'âge a été modifié", `**${dbCommandUser.infosRP.age}** en **${collectorValue.first().content}**`)
                                .setColor("#26D6FF");
                            client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                            verif = false
                        }
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        info_embed = await client.loadInfoEmbed(commanduser);
                        return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                    }
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editsexe": {
                const sexeRow = new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId('sexe')
                            .setPlaceholder('Barre de Sélection')
                            .addOptions([
                                {
                                    label: 'Homme 🚹',
                                    value: 'Homme',
                                },
                                {
                                    label: 'Femme 🚺',
                                    value: 'Femme',
                                },
                                {
                                    label: 'Autre',
                                    value: 'Autre',
                                },
                            ]),
                    );

                await i.editReply({ embeds: [value_embed], components: [sexeRow] });
                try {
                    collectorValue = await i.message.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000 })
                    await client.updateUser(commanduser, { "infosRP.sexe": collectorValue.values[0] });
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("Le sexe a été modifié", `**${dbCommandUser.infosRP.sexe}** en **${collectorValue.values[0]}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editrace": {
                const raceRow = new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId('race')
                            .setPlaceholder('Barre de Sélection')
                            .addOptions([
                                {
                                    label: 'Humain',
                                    value: 'Humain',
                                },
                                {
                                    label: 'Elfe',
                                    value: 'Elfe',
                                },
                                {
                                    label: 'Sorcière',
                                    value: 'Sorcière',
                                },
                                {
                                    label: 'Nain',
                                    value: 'Nain',
                                },
                                {
                                    label: 'Homme Poisson',
                                    value: 'Homme Poisson',
                                },
                                {
                                    label: 'Démon',
                                    value: 'Démon',
                                },
                            ]),
                    );

                await i.editReply({ embeds: [value_embed], components: [raceRow] });
                try {
                    collectorValue = await i.message.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000 })
                    await client.updateUser(commanduser, { "infosRP.race": collectorValue.values[0] });
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("La race a été modifié", `**${dbCommandUser.infosRP.race}** en **${collectorValue.values[0]}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editorigine": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    await client.updateUser(commanduser, { "infosRP.origine": collectorValue.first().content });
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("L'origine a été modifié", `**${dbCommandUser.infosRP.origine}** en **${collectorValue.first().content}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editmagie": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    await client.updateUser(commanduser, { "infosRP.grimoire.magie": collectorValue.first().content });
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("La magie a été modifié", `**${dbCommandUser.infosRP.grimoire.magie}** en **${collectorValue.first().content}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editrank": {
                const grimoireRankRow = new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId('grimoireRank')
                            .setPlaceholder('Barre de Sélection')
                            .addOptions([
                                {
                                    label: 'Inconnu',
                                    value: 'Inconnu',
                                },
                                {
                                    label: '1 ☘️',
                                    value: '1 ☘️',
                                },
                                {
                                    label: '2 ☘️',
                                    value: '2 ☘️',
                                },
                                {
                                    label: '3 ☘️',
                                    value: '3 ☘️',
                                },
                                {
                                    label: '4 🍀',
                                    value: '4 🍀',
                                },
                                {
                                    label: '5 ☘️',
                                    value: '5 ☘️',
                                },
                            ]),
                    );

                await i.editReply({ embeds: [value_embed], components: [grimoireRankRow] });
                try {
                    collectorValue = await i.message.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000 })
                    await client.updateUser(commanduser, { "infosRP.grimoire.rank": collectorValue.values[0] });
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("La rang de grimoire a été modifié", `**${dbCommandUser.infosRP.grimoire.rank}** en **${collectorValue.values[0]}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editere": {
                const grimoireEreRow = new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId('grimoireEre')
                            .setPlaceholder('Barre de Sélection')
                            .addOptions([
                                {
                                    label: 'Ancien',
                                    value: 'Ancien',
                                },
                                {
                                    label: 'Perdu',
                                    value: 'Perdu',
                                },
                                {
                                    label: 'Antique',
                                    value: 'Antique',
                                }
                            ]),
                    );

                await i.editReply({ embeds: [value_embed], components: [grimoireEreRow] });
                try {
                    collectorValue = await i.message.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000 })
                    await client.updateUser(commanduser, { "infosRP.grimoire.ere": collectorValue.values[0] });
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("L'ère du grimoire a été modifié", `**${dbCommandUser.infosRP.grimoire.ere}** en **${collectorValue.values[0]}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editcompagnie": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                    await client.updateUser(commanduser, { "infosRP.compagnie": collectorValue.first().content });
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                    const logs_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                        .addField("La compagnie a été modifié", `**${dbCommandUser.infosRP.compagnie}** en **${collectorValue.first().content}**`)
                        .setColor("#26D6FF");
                    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    info_embed = await client.loadInfoEmbed(commanduser);
                    return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editapparence": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                        if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        else if (collectorValue.first().content === "Aucune") {
                            verif = false
                            await client.updateUser(commanduser, { "infosRP.apparence": "https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png" });
                        }
                        else if (!isImageUrl(collectorValue.first().content)) return message.channel.send("**Ceci n'est pas un lien d'image valide !**").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            await client.updateUser(commanduser, { "infosRP.apparence": collectorValue.first().content });
                            const logs_embed = new MessageEmbed()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                                .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                                .addField("L'apparence a été modifié", `**${dbCommandUser.infosRP.apparence}** en **${collectorValue.first().content}**`)
                                .setColor("#26D6FF");
                            client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                            verif = false
                        }
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        info_embed = await client.loadInfoEmbed(commanduser);
                        return await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                    }
                }
                info_embed = await client.loadInfoEmbed(commanduser);
                await i.editReply({ embeds: [info_embed], components: [row, infosRow1, infosRow2] });
                break;
            }
            case "editvitalite": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.vitalite": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La stat de vitalité a été modifié", `**${dbCommandUser.stats.vitalite}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editforce": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.force": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La stat de force a été modifié", `**${dbCommandUser.stats.force}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editresistance": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.resistance": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La stat de résistance a été modifié", `**${dbCommandUser.stats.resistance}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editagilite": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.agilite": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La stat d'agilité a été modifié", `**${dbCommandUser.stats.agilite}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editreserveMagique": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.reserveMagique": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La stat de réserve magique a été modifié", `**${dbCommandUser.stats.reserveMagique}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editmaitriseMagique": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.maitriseMagique": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La stat de maitrise magique a été modifié", `**${dbCommandUser.stats.maitriseMagique}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editpointsLeft": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.pointsLeft": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La nombre de points vacants a été modifié", `**${dbCommandUser.stats.pointsLeft}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editbalance": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.balance": collectorValue.first().content });
                        await client.reloadStatus(commanduser);

                        const status_logs_embed = new MessageEmbed()
                            .setDescription(`**Le status de ${commanduser} a été actualisé !**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });

                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("La monnaie a été modifié", `**${dbCommandUser.stats.balance}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editxp": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.xp": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("L'XP a été modifié", `**${dbCommandUser.stats.xp}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "editlvl": {
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                    collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });

                    if (!collectorValue.first().content) return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                    else {
                        await client.updateUser(commanduser, { "stats.lvl": collectorValue.first().content });
                        const logs_embed = new MessageEmbed()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`**${message.author} a modifié le perso de ${commanduser} !**`)
                            .addField("Le niveau a été modifié", `**${dbCommandUser.stats.lvl}** en **${collectorValue.first().content}**`)
                            .setColor("#26D6FF");
                        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ content: "<@496044799024168997>", embeds: [logs_embed] });
                        verif = false
                    }
                    if (collectorValue.first().deletable) await collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                    stat_embed = await client.loadStatEmbed(commanduser);
                    return await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                }
                }
                stat_embed = await client.loadStatEmbed(commanduser);
                await i.editReply({ embeds: [stat_embed], components: [row, statsRow1, statsRow2] });
                break;
            }
            case "finish": {

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Commande terminée avec succès.` })
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [] });
                break;
            }
        }
        await collector.resetTimer();
    });
}


module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.EDIT_PERSO;

