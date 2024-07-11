const { Client, Collection, Intents } = require("discord.js");

const allIntents = new Intents(32767);
const client = new Client({ intents: [allIntents] });

const { loadCommands, loadEvents } = require("./util/loader");
require("./util/functions")(client);
client.mongoose = require("./util/mongoose");
client.config = require("./config");
client.serverSettings = require("./serverSettings");
client.invites = new Map();
["commands", "cooldowns"].forEach(x => client[x] = new Collection());


loadCommands(client);
loadEvents(client);

client.mongoose.init();

client.login(client.config.token);
