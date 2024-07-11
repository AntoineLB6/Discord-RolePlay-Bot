const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args) => {
    
    client.majLb(client).then(() => message.reply("Le LeaderBoard a été actualisé."));
}

module.exports.help = MESSAGES.COMMANDS.ADMINISTRATION.MAJ_LEADERBOARD;