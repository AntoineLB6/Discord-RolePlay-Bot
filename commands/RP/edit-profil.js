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

    let main_embed = await client.loadProfilEmbed(commanduser);

    const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('finish')
                .setEmoji('🔚')
                .setLabel('Finir')
                .setStyle('SECONDARY'),
        );
    const profilRow1 = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('editmaincolor')
                .setEmoji('🔴')
                .setLabel('Couleur')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editsecondarycolor')
                .setEmoji('🟣')
                .setLabel('Couleur')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('editbackground')
                .setEmoji('🗺️')
                .setLabel('Fond')
                .setStyle('SUCCESS'),
        );

    const EditMessage = await message.channel.send({ embeds: [main_embed], components: [row, profilRow1] });

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
                main_embed = await client.loadProfilEmbed(commanduser);
                await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                break;
            }
            case "editmaincolor": {
                const value_embed = new MessageEmbed()

                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .setDescription(`**Quelle est la couleur que vous souhaitez attribuer ?**\nNous demandons un code hexadécimal, donc sous la forme de \`#ffffff\`, pour sélectionner facilement votre couleur, vous pouvez vous aider avec le site suivant :\nhttps://htmlcolorcodes.com/fr/`)
                    .setColor("#FF10AF");
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                        if (!collectorValue.first().content.toUpperCase().match(/^#([0-9A-F]){6}$/)) message.channel.send("Ceci n'est pas un code hexadécimal.").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            await client.updateUser(commanduser, { "profil.mainColor": collectorValue.first().content.toUpperCase() });
                            const logs_embed = new MessageEmbed()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                                .setDescription(`**${message.author} a modifié son profil !**`)
                                .addField("La couleur de profil a été modifiée", `**${dbCommandUser.profil.mainColor.toUpperCase()}** en **${collectorValue.first().content}**`)
                                .setColor("#26D6FF");
                            client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
                            verif = false
                        }
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        main_embed = await client.loadProfilEmbed(commanduser);
                        return await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                    }
                }
                main_embed = await client.loadProfilEmbed(commanduser);
                await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                break;
            }
            case "editsecondarycolor": {
                const value_embed = new MessageEmbed()

                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .setDescription(`**Quelle est la couleur que vous souhaitez attribuer ?**\nNous demandons un code hexadécimal, donc sous la forme de \`#ffffff\`, pour sélectionner facilement votre couleur, vous pouvez vous aider avec le site suivant :\nhttps://htmlcolorcodes.com/fr/`)
                    .setColor("#FF10AF");
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                        if (!collectorValue.first().content.toUpperCase().match(/^#([0-9A-F]){6}$/)) message.channel.send("Ceci n'est pas un code hexadécimal.").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            await client.updateUser(commanduser, { "profil.secondaryColor": collectorValue.first().content.toUpperCase() });
                            const logs_embed = new MessageEmbed()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                                .setDescription(`**${message.author} a modifié son profil !**`)
                                .addField("La couleur de profil a été modifiée", `**${dbCommandUser.profil.secondaryColor.toUpperCase()}** en **${collectorValue.first().content}**`)
                                .setColor("#26D6FF");
                            client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
                            verif = false
                        }
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        main_embed = await client.loadProfilEmbed(commanduser);
                        return await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                    }
                }
                main_embed = await client.loadProfilEmbed(commanduser);
                await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                break;
            }
            case "editbackground": {
                const value_embed = new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .setDescription("**Quelle est le fond que vous souhaitez attribuer !** (Si vous souhaitez obtenir le fond par défaut, tapez : \`Aucune\`)")
                    .setColor("#6010FF");
                await i.editReply({ embeds: [value_embed], components: [] });
                while (verif) {
                    try {
                        collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                        if (collectorValue.first().content === "Aucune") {
                            verif = false
                            await client.updateUser(commanduser, { "profil.background": "https://media.discordapp.net/attachments/876577400023052381/973953907736838224/unknown.png?width=722&height=406" });
                        }
                        else if (!isImageUrl(collectorValue.first().content)) return message.channel.send("**Ceci n'est pas un lien d'image valide !**").then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        })
                        else {
                            await client.updateUser(commanduser, { "profil.background": collectorValue.first().content });
                            const logs_embed = new MessageEmbed()
                                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                                .setDescription(`**${message.author} a modifié son profil !**`)
                                .addField("La fond du profil a été modifiée", `**${dbCommandUser.profil.background}** en **${collectorValue.first().content}**`)
                                .setColor("#26D6FF");
                            client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
                            verif = false
                        }
                        if (collectorValue.first().deletable) await collectorValue.first().delete();
                    } catch (err) {
                        message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
                        main_embed = await client.loadProfilEmbed(commanduser);
                        return await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                    }
                }
                main_embed = await client.loadProfilEmbed(commanduser);
                await i.editReply({ embeds: [main_embed], components: [row, profilRow1] });
                break;
            }
            case "finish": {

                main_embed = new MessageEmbed()

                    .setAuthor({ name: `Commande terminée avec succès.` })
                    .setColor("#00B8FF");
                await i.editReply({ embeds: [main_embed], components: [] });
                break;
            }
        }
        await collector.resetTimer();
    });
}


module.exports.help = MESSAGES.COMMANDS.RP.EDIT_PROFIL;