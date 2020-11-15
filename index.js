const { mkdirSync, readFileSync, writeFileSync, unlinkSync } = require("fs");
const { Client, MessageEmbed } = require("discord.js");
const config = require("./config.json");
const client = new Client();

const log = message => {
    writeFileSync("./log.txt", `[${new Date().toISOString()}] ${message}\n`, { flag: "a"});
    console.log(message);
}

try {
    mkdirSync("./guilds");
    log("INFO: Created the guilds directory");
} catch (e) {
    if (e.code !== "EEXIST") {
        return log(`ERROR: An error occured creating the guild directory: ${e}`);
    }
}

client.on('ready', () => {
    log(`INFO: Connected to Discord as ${client.user.tag} with prefix "${config.prefix}"`);

     log('Servers: '+client.guilds.cache.size)

    client.user.setActivity(config.activity, {type: config.type})
        .catch(() => log("WARN: Unable to set activity"));

    // VVV Stuff that needs to happens after the bot starts should be put here VVV
});

client.on("guildDelete", guild => {
    try {
        unlinkSync("./guilds/" + guild.id);
    } catch (e) {
        // If the entry doesn't exist, then there's nothing to delete
        if (e.code === "ENOENT") return

        return log(`ERROR: An error occurred deleting the entry for guild ${guild.id}: ${e}`);
    }

    log(`INFO: Deleted entry for guild ${guild.id}`);
});

client.on("message", message => {
    // Ignore bots
    if (message.author.bot) return;

    // Check for prefix, and get args array
    if (!message.content.startsWith(config.prefix)) return
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);

    switch (args.shift()) {
        case "join":
            // TODO: Should I add an error message if not?
            // User needs MANAGE_GUILD perms for this command
            if (!message.member.hasPermission("MANAGE_GUILD")) return


            const channel = message.guild.channels.resolve(args.shift());

            if (!channel) {
                return message.channel.send("Invalid channel id");
            }

            writeFileSync("./guilds/" + message.guild.id, channel.id);
            log(`INFO: Set ${channel.id} as join channel for guild ${message.guild.id}`)

            return message.channel.send("Channel set as join channel")
    }
});

client.on("guildMemberAdd", onMemberJoinOrLeave);
client.on("guildMemberRemove", onMemberJoinOrLeave);

async function onMemberJoinOrLeave(member) {
    // Ignore its own leave event
    if (member.id === client.user.id) return;

    const channel = getJoinChannel(member.guild);
    if (!channel) return;

    let embed;
    // If the member is "deleted", they have left
    if (member.deleted) {
        embed = new MessageEmbed()
            .setTitle(`${member.displayName} Left ${member.guild.name}`)
            .setColor(0xFF0000)
            .setDescription("Cya")
            .addField("Total Members", member.guild.memberCount)
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL());
    } else {
        embed = new MessageEmbed()
            .setTitle(`Welcome ${member.displayName} To ${member.guild.name}`)
            .setColor(0x008000)
            .setDescription(`Welcome To ${member.guild.name}`)
            .addField("Time Joined:", member.joinedAt.toUTCString())
            .addField("Account Creation Date", member.user.createdAt.toUTCString())
            .addField("Total Members", member.guild.memberCount)
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL());
    }

    channel.send(embed);
}

function getJoinChannel(guild) {
    let channelId;
    try {
        channelId = readFileSync("./guilds/" + guild.id, { encoding: "utf-8" });
    } catch (e) {
        // If the file doesn't exist, there's no join channel
        if (e.code === "ENOENT") {
            return;
        }

        log(`ERROR: An error occurred fetching the entry for guild ${guild.id}`);
        return;
    }

    return guild.channels.resolve(channelId);
}

client.login(config.token)
    .catch(e => log(`ERROR: Error connecting to discord: ${e}`));
