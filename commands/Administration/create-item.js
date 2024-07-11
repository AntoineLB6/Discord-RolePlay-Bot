const { MESSAGES } = require("../../util/constants");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    let item = {
        name: "",
        description: "",
        usage: "",
        prix: 0,
        zones: []
    }

    let info_embed = new MessageEmbed()

        .setAuthor({ name: `Création d'objet` })
        .addFields([
            { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
            { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
            { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
            { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
            { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
        ])
        .setColor("#00B8FF");

    const value_embed = new MessageEmbed()

        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**Quelle est la valeur que vous souhaitez mettre ?**`)
        .setColor("#FF10AF");

    const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('name')
                .setEmoji('㊙️')
                .setLabel('Nom')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('description')
                .setEmoji('📜')
                .setLabel('Description')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('usage')
                .setEmoji('✏️')
                .setLabel('Usage')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('prix')
                .setEmoji('💰')
                .setLabel('Prix')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('zones')
                .setEmoji('🗺️')
                .setLabel('Zones')
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
        switch (i.customId) {
            case "name": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    const collectorValue = await i.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["time"] })
                    item.name = collectorValue.first().content;
                    if (collectorValue.first().deletable) collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Condition non remplies, commande annulée !**");
                    info_embed = new MessageEmbed()

                        .setAuthor({ name: `Création d'objet` })
                        .addFields([
                            { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                            { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                            { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                            { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                            { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                        ])
                        .setColor("#00B8FF");
                    return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                }
                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création d'objet` })
                    .addFields([
                        { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                        { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                        { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                        { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                        { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "description": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    const collectorValue = await i.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["time"] })
                    if (!collectorValue.first().content) return message.channel.send("Commande annulée.")
                    item.description = collectorValue.first().content;
                    if (collectorValue.first().deletable) collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Condition non remplies, commande annulée !**");
                    info_embed = new MessageEmbed()

                        .setAuthor({ name: `Création d'objet` })
                        .addFields([
                            { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                            { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                            { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                            { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                            { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                        ])
                        .setColor("#00B8FF");
                    return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                }
                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création d'objet` })
                    .addFields([
                        { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                        { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                        { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                        { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                        { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "usage": {
                await i.editReply({ embeds: [value_embed], components: [] });
                try {
                    const collectorValue = await i.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["time"] })
                    if (!collectorValue.first().content) return message.channel.send("Commande annulée.")
                    item.usage = collectorValue.first().content;
                    if (collectorValue.first().deletable) collectorValue.first().delete();
                } catch (err) {
                    message.channel.send("**Condition non remplies, commande annulée !**");
                    info_embed = new MessageEmbed()

                        .setAuthor({ name: `Création d'objet` })
                        .addFields([
                            { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                            { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                            { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                            { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                            { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                        ])
                        .setColor("#00B8FF");
                    return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                }

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création d'objet` })
                    .addFields([
                        { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                        { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                        { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                        { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                        { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "prix": {
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
                            item.prix = collectorValue.first().content;
                            verif = false
                        }
                        if (collectorValue.first().deletable) collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Condition non remplies, commande annulée !**");
                        info_embed = new MessageEmbed()

                            .setAuthor({ name: `Création d'objet` })
                            .addFields([
                                { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                                { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                                { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                                { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                                { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                            ])
                            .setColor("#00B8FF");
                        return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                    }
                }

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création d'objet` })
                    .addFields([
                        { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                        { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                        { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                        { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                        { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "zones": {
                let verif = true;
                while (verif) {
                    let zonesString = "";
                    if (item.zones.length === 0) zonesString = "Aucune";
                    else zonesString = item.zones.join(", ");

                    const zones_value_embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`**Veuillez mentionner toutes les zones où l'item est achetable, liste des zones :**\n\n${zonesString}\n\n**Une fois que vous aurez fini votre liste, tapez : \`.finish\`\nSi vous souhaitez retirer un item de la liste, veuillez rajouter le préfixe \`-\` collé devant la zone existante.**`)
                        .setColor("#FF3926");
                    await i.editReply({ embeds: [zones_value_embed], components: [] });

                    collectorValue = "";
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["time"] });
                        if (collectorValue.first().content === "exit") return message.channel.send("**La commande a été annulée.**");
                        else if (collectorValue.first().content === ".finish") verif = false
                        else if (collectorValue.first().content.startsWith("-")) {
                            const q = await item.zones.indexOf(collectorValue.first().content.slice(1));
                            if (q == -1) message.channel.send("Cette zone n'est pas dans la liste.").then(msg => {
                                setTimeout(() => msg.delete(), 5000)
                            })
                            else await item.zones.splice(q, 1);
                        }
                        else item.zones.push(collectorValue.first().content)
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Condition non remplies, commande annulée !**");
                        info_embed = new MessageEmbed()

                            .setAuthor({ name: `Création d'objet` })
                            .addFields([
                                { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                                { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                                { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                                { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                                { name: "Zones", value: item.zones.length < 0 ? item.zones.join(", ") : "Aucune", inline: false }
                            ])
                            .setColor("#00B8FF");
                        return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                    }
                }

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Création d'objet` })
                    .addFields([
                        { name: "Nom", value: item.name ? item.name : "Aucun", inline: false },
                        { name: "Description", value: item.description ? item.description : "Aucun", inline: false },
                        { name: "Usage", value: item.usage ? item.usage : "Aucun", inline: false },
                        { name: "Prix", value: item.prix ? item.prix : "Aucun", inline: false },
                        { name: "Zones", value: item.zones.length > 0 ? item.zones.join(", ") : "Aucune", inline: false }
                    ])
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [row, row2] });
                break;
            }
            case "finish": {
                if (!item.name || !item.description || !item.usage || !item.prix) {
                    info_embed.addField(":warning: Erreur !", "**Un des champs n'est pas rempli correctment.**")
                    return await i.editReply({ embeds: [info_embed], components: [row, row2] });
                }

                const shop = dbGuild.shop;
                await shop.push(item)
                await client.updateGuild({ shop });

                info_embed = new MessageEmbed()

                    .setAuthor({ name: `Item créé avec succès` })
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [info_embed], components: [] });
                break;
            }
        }
        await collector.resetTimer();
    });

    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a créé l'item ${item.name} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.shopLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.CREATE_ITEM;