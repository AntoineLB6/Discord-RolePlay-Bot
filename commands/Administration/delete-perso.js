const { MESSAGES } = require("../../util/constants");
const { User } = require("../../models/index");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, dbUser) => {

    const user = message.mentions.members.first();
    if (!user) return message.channel.send("Tu dois mentionner la personne à qui tu souhaites supprimer le personnage.");

    User.deleteOne({ userID: user.id }).then(message.channel.send(`Le personnage de ${user} a été supprimé.`)).catch(e => {
        message.channel.send(`Je n'ai pas réussi à supprimer le personnage de ${user}`)
        console.log(e)
    }
    );
    
    const logs_embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**${message.author} a supprimé le personnage de ${user} !**`)
        .setColor("#26D6FF");
    client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.DELETE_PERSO;