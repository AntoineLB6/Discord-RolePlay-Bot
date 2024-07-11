const { MessageEmbed } = require("discord.js");
const { Invite } = require("../../models/index");

module.exports = async (client, member) => {

    const dbInvite = await client.getInvite(member);
    member.guild.members.fetch(dbInvite.inviter).then(async inviter => {
        await Invite.findOneAndUpdate(
            { userID: inviter.id },
            {
                $pull: {
                    invites: member.id
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
    })

    const embed = new MessageEmbed()

        .setAuthor({ name: member.id, iconURL: member.user.displayAvatarURL() })
        .setDescription(`${member.user.tag} a quitté le serveur.`)
        .setTimestamp()
        .setColor("#FF9610");

    client.channels.fetch(client.serverSettings.memberLogsChannelId).then(c => c.send({ embeds: [embed] }));
};