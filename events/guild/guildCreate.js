module.exports = async (client, guild) => {
    const firstInvites = await guild.invites.fetch();
    client.invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
};