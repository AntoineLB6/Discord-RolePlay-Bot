const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args) => {
    let dbInvite = await client.getInvite(message.member);
      if (!dbInvite) {
          await client.createInvite({
              userID: member.id,
              inviter: "Unknown"
          });
          newMember = await client.getInvite(message.member);
        }
  message.channel.send({ content: `Tu as ${dbInvite.invites.length} invitations.`})
};

module.exports.help = MESSAGES.COMMANDS.MISC.INVITES;
