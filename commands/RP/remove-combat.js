const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    if (message.channel.type !== "GUILD_PUBLIC_THREAD") return message.channel.send("Cette commande est uniquement disponible à l'intérieur d'un channel de combat.");
    const user = message.mentions.members.first();
    if (!user) return message.channel.send("Tu dois mentionner la personne que tu souhaites retirer du combat.");
    const combatList = await dbGuild.combats;
    const combat = combatList.find(c => c.threadChannelID === message.channel.id)
    const q = await combat.participants.indexOf(user.id);
    if (q == -1) return message.channel.send("Ce joueur ne fait pas parti du combat.")

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

    const confirmation_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**Cette action est irrévocable, êtes-vous sûr de votre décision ?**`)
        .setColor("#FF0000");

    const msgToModify = await message.channel.send({ embeds: [confirmation_embed], components: [row] });
    try {
        const interactionfilter = i => i.user.id === message.author.id;
        let collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, time: 120000, errors: ["time"] })
        if (collectorValue.customId === "non") return message.channel.send("**La commande a été annulée.**").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
        else {
            await combat.participants.splice(q, 1);
            await client.updateGuild({ combats: combatList });
            await client.reloadStatus(user);

            const status_logs_embed = new MessageEmbed()
                .setDescription(`**Le status de ${user} a été actualisé !**`)
                .setColor("#26D6FF");
            client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });

            const thisChannel = await client.channels.fetch(combat.channelID);
            thisChannel.permissionOverwrites.delete(user.id);

            const final_embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                .setDescription(`**${user} a été retiré au combat !**`)
                .setColor("#26D6FF");
            collectorValue.update({ embeds: [final_embed], components: [] });

            const logs_embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                .setDescription(`**${user} a été retiré du combat de ${message.channel} par ${message.author} !**`)
                .setColor("#26D6FF");
            client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
        }
    } catch (err) {
        return message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }
};

module.exports.help = MESSAGES.COMMANDS.RP.REMOVE_COMBAT;