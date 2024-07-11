const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    incomes: [],
    shop: [],
    combats: [],
    ticketsPartenariat: [],
    ticketsSupport: []
});

module.exports = mongoose.model("Guild", guildSchema);
