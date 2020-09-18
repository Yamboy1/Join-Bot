const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const { Client, MessageEmbed, GuildMember } = require("discord.js");
const config = require("./config.json");
const client = new Client();

client.on('ready', () => {
    console.log("change this part") // needed for startup on ptero
    client.user.setActivity(config.activity, { type: config.type });
});

client.on("guildDelete", guild => {
    try {
        unlinkSync("./guilds/"+guild.id);
    } catch (e) {
        console.log(`An error occurred deleting the file: ${e}`);
    }
});

client.on("message", async (message) => {
   // Ignore bots
    if (message.author.bot) return;
  if (!message.member.hasPermission("MANAGE_GUILD")) return
  const arr = message.content.match(new RegExp(`^${config.prefix}join (.+)`));
  if (arr == null) return;

  const [,capture] = arr;
  const channel = message.guild.channels.resolve(capture);
  if (!channel) return message.channel.send("Invalid channel id");
  writeFileSync("./guilds/"+ message.guild.id, channel.id);
  message.channel.send("Channel set as join channel")
});

client.on("guildMemberAdd", async member => {
  const channel = getJoinChannel(member.guild);
  if (channel) channel.send({ embed: await createJoinEmbed(member) })
})

client.on("guildMemberRemove", async member => {
  const channel = getJoinChannel(member.guild);
  if (channel) channel.send({ embed: await createLeaveEmbed(member) })
})

function getJoinChannel(guild) {
  let channelId;
  try {
    channelId = readFileSync('./guilds/'+guild.id, { encoding: 'utf-8' })
  } catch (e) {
    return null
  }

  console.log(channelId);
  return guild.channels.resolve(channelId);
}

async function createJoinEmbed(member) {
  // vs code typechecking
  if (!(member instanceof GuildMember)) return;
  return new MessageEmbed()
    .setTitle(`Welcome ${member.displayName} To ${member.guild.name}`)
    .setColor(0x008000)
    .setDescription(`Welcome To ${member.guild.name}`)
    .addField("Time Joined:", member.joinedAt.toUTCString())
    .addField("Account Creation Date", member.user.createdAt.toUTCString())
    .addField("Total Members", member.guild.memberCount)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());
}

async function createLeaveEmbed(member) {
  // vs code typechecking
  if (!(member instanceof GuildMember)) return;
  return new MessageEmbed()
    .setTitle(`${member.displayName} Left ${member.guild.name}`)
    .setColor(0xFF0000)
    .setDescription("Cya")
    .addField("Total Members", member.guild.memberCount)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());
}

client.login(config.token);
