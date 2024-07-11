const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { MESSAGES } = require("../../util/constants");
const isImageUrl = require("is-image-url");

module.exports.run = async (client, message, args, dbUser) => {
    if (dbUser) return message.reply("**Tu as déjà fais cette commande !**");
    if (!message.member.roles.cache.has("1141416656195817523")) return message.channel.send("**Il faut que tu fasses valider ta fiche pour cela.**");

    const row = new MessageActionRow();
    const interactionfilter = i => i.user.id === message.author.id;
    const msgfilter = m => m.author.id === message.author.id;
    let infosRP = {};
    let collectorValue;
    let verif = true;

    // Name
    const name_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("**Merci d'entrer le nom de votre personnage !** (Tapez `.exit` afin d'annuler la commande.)")
        .setColor("#00FFDA");
    const msgToModify = await message.channel.send({ embeds: [name_embed] });
    try {
        collectorValue = await msgToModify.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
        if (collectorValue.first().content === ".exit") return message.channel.send("**La commande a été annulée.**");
        else infosRP.name = collectorValue.first().content;
        if (collectorValue.first().deletable) await collectorValue.first().delete();
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }

    // Age
    while (verif) {
        const age_embed = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription("**Merci d'entrer l'âge de votre personnage maintenant ! (Tapez `.exit` afin d'annuler la commande.)**")
            .setColor("#FF3926");
        await msgToModify.edit({ embeds: [age_embed] });

        try {
            collectorValue = await msgToModify.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
            if (collectorValue.first().content === ".exit") return message.channel.send("**La commande a été annulée.**");
            else if (isNaN(collectorValue.first().content)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                setTimeout(() => msg.delete(), 5000)
            })
            else {
                infosRP.age = collectorValue.first().content;
                verif = false
            }
            if (collectorValue.first().deletable) await collectorValue.first().delete();
        } catch (err) {
            return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
        }

    }

    // Sexe
    const sexe_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("Veuillez sélectionner votre sexe.")
        .setColor("#9400FF");

    row.setComponents(
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
                    label: 'Annuler Commande',
                    value: 'exit',
                },
            ]),
    );

    await msgToModify.edit({ embeds: [sexe_embed], components: [row] });
    try {
        collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000, errors: ["time"] });
        if (collectorValue.values[0] === "exit") return message.channel.send("**La commande a été annulée.**");
        infosRP.sexe = collectorValue.values[0];
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }

    // Origine
    const origine_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("Veuillez sélectionner votre lieu d'origine.")
        .setColor("#FFF110");

    row.setComponents(
        new MessageSelectMenu()
            .setCustomId('origine')
            .setPlaceholder('Barre de Sélection')
            .addOptions([
                {
                    label: 'Yelyra',
                    value: 'Yelyra',
                },
                {
                    label: 'Shaundyl',
                    value: 'Shaundyl',
                },
                {
                    label: 'Annuler Commande',
                    value: 'exit',
                },
            ]),
    );

    await collectorValue.update({ embeds: [origine_embed], components: [row] });
    try {
        collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, componentType: 'SELECT_MENU', time: 120000, errors: ["time"] });
        if (collectorValue.values[0] === "exit") return message.channel.send("**La commande a été annulée.**");
        infosRP.origine = collectorValue.values[0];
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }

    // Magie
    /*
    const magie_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("**Merci d'entrer le nom de votre magie !** (Tapez `.exit` afin d'annuler la commande.)")
        .setColor("#3BFF10");
    await collectorValue.update({ embeds: [magie_embed], components: [] });
    try {
        collectorValue = await msgToModify.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
    if (collectorValue.first().content === ".exit") message.channel.send("**La commande a été annulée.**");
    infosRP.grimoire.magie = collectorValue.first().content;
    if (collectorValue.first().deletable) await collectorValue.first().delete();
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }
    */

    // Apparence
    const apparence_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("**Merci d'entrer un lien vers l'apparence de votre personnage !** (Si vous n'en avez pas pour le moment, tapez : \`Aucune\`)")
        .setColor("#6010FF");
    await collectorValue.update({ embeds: [apparence_embed], components: [] });
    verif = true;
    while (verif) {
        try {
            collectorValue = await msgToModify.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
            if (collectorValue.first().content === "Aucune") {
                verif = false
                infosRP.apparence = "https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png"
            }
            else if (!isImageUrl(collectorValue.first().content)) return message.channel.send("**Ceci n'est pas un lien d'image valide !**").then(msg => {
                setTimeout(() => msg.delete(), 5000)
            })
            else {
                infosRP.apparence = collectorValue.first().content;
                verif = false
            }
            if (collectorValue.first().deletable) await collectorValue.first().delete();
        } catch (err) {
            return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
        }
    }

    // Confirmation

    const confirmation_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription("**Merci de bien vouloir vérifier vos informations afin de voir si elles sont correctes !**")
        .addFields([
            { name: "Nom RP:", value: infosRP.name, inline: true },
            { name: "Âge:", value: infosRP.age, inline: true },
            { name: "Sexe:", value: infosRP.sexe, inline: true },
            { name: "Origine:", value: infosRP.origine, inline: true },
            // { name: "Magie:", value: infosRP.magie, inline: true },
        ])
        .setImage(infosRP.apparence)
        .setColor("#FF0000");

    row.setComponents(
        new MessageButton()
            .setCustomId('oui')
            .setLabel('CONFIRMER')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('non')
            .setLabel('ANNULER')
            .setStyle('DANGER'),
    );

    await msgToModify.edit({ embeds: [confirmation_embed], components: [row] });
    try {
        collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, time: 120000, errors: ["time"] })
        const confirmation = collectorValue.customId;
        if (confirmation === "non") return message.channel.send("**La commande a été annulée !**");

        await client.createUser(message.member, {
            userID: message.member.id,
            infosRP
        });
        await client.reloadStatus(commanduser);

        const status_logs_embed = new MessageEmbed()
            .setDescription(`**Le status de ${commanduser} a été actualisé !**`)
            .setColor("#26D6FF");
        client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });
    
        const final_embed = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription("**Votre personnage a été créé avec succés !**")
            .setColor("#26D6FF");
        collectorValue.update({ embeds: [final_embed], components: [] });
    
        const logs_embed = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription(`**${message.author} vient de créer son personnage !**`)
            .setColor("#26D6FF");
        client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }
};

module.exports.help = MESSAGES.COMMANDS.RP.CREATE_PERSO;