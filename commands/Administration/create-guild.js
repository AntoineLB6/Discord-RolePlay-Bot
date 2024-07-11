const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args) => {
    await client.createGuild().catch(() => message.reply("Je n'ai pas réussi."));
};

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.CREATE_GUILD;
