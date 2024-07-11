const mongoose = require("mongoose");

const inviteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    inviter: String,
    invites: []
});

module.exports = mongoose.model("Invite", inviteSchema);
