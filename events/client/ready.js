const cron = require('cron');

module.exports = async client => {

    const manajob = new cron.CronJob('0 * * * *', function () {
        console.log('Mana Restauré');
        client.getUsers().then(user => {
            user.forEach(async coluser => {
                if (coluser.stats.mana + 5 > coluser.stats.reserveMagique) await coluser.updateOne(
                    { "stats.mana": coluser.stats.reserveMagique }
                );
                else await coluser.updateOne(
                    { "stats.mana": coluser.stats.mana + 5 }
                );
            });
        });
    });
    const dailytrainjob = new cron.CronJob('00 00 * * *', function () {
        console.log('Train jour réactualisé');
        client.getUsers().then(user => {
            user.forEach(async coluser => {
                await coluser.updateOne(
                    { "trains.daily": true }
                )
            });
        });
    });
    const weeklytrainjob = new cron.CronJob('0 0 * * 0', function () {
        console.log('Train semaine réactualisé');
        client.getUsers().then(user => {
            user.forEach(async coluser => {
                await coluser.updateOne(
                    { "trains.weekly": 3 }
                )
            });
        });
    });
    const incomejob = new cron.CronJob('00 00 */3 * *', function () {
        console.log('Income réactualisé');
        client.getUsers().then(user => {
            user.forEach(async coluser => {
                await coluser.updateOne(
                    { train: true }
                )
            });
        });
    });
    const lbjob = new cron.CronJob('00 00 */3 * *', function () {
        client.majLb(client);
    });

    manajob.start();
    dailytrainjob.start();
    weeklytrainjob.start();
    incomejob.start();
    lbjob.start();

    await client.majLb(client);

    if (client.guilds.cache.size !== "0") await client.guilds.cache.forEach(async (guild) => {
        const firstInvites = await guild.invites.fetch();
        client.invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
    });

    console.log(`Logged in as ${client.user.tag}!`);
};
