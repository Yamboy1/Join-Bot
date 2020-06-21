const { readFileSync, writeFileSync } = require("fs");
const { Client, MessageEmbed, GuildMember } = require("discord.js");
const { token } = require("./config.json");
const client = new Client();

client.on("message", (message) => {
  const arr = message.content.match(/!join (.+)/);
  if (arr == null) return;

  const [,capture] = arr;
  const channel = message.guild.channels.resolve(capture);
  if (!channel) return message.channel.send("Invalid channel id");
  writeFileSync("./guilds/"+ message.guild.id, channel.id);
  message.channel.send("Channel set as join channel")
});

client.on("guildMemberAdd", member => {
  const channel = getJoinChannel(member.guild);
  if (channel) channel.send({ embed: createJoinEmbed(member) })
})

client.on("guildMemberRemove", member => {
  const channel = getJoinChannel(member.guild);
  if (channel) channel.send({ embed: createLeaveEmbed(member) })
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

function createJoinEmbed(member) {
  // vs code typechecking
  if (!(member instanceof GuildMember)) return;
  return new MessageEmbed()
    .setTitle(`Welcome ${member.displayName} To ${member.guild.name}`)
    .setColor(0x008000)
    .setDescription(`Welcome To ${member.guild.name}`)
    .addField("Time Joined:", member.joinedAt.toUTCString())
    .addField("Account Creation Date", member.user.createdAt.toUTCString())
    .addField("Total Members", member.guild.members.cache.size)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());
}

function createLeaveEmbed(member) {
  // vs code typechecking
  if (!(member instanceof GuildMember)) return;
  return new MessageEmbed()
    .setTitle(`${member.displayName} Left ${member.guild.name}`)
    .setColor(0xFF0000)
    .setDescription("Cya")
    .addField("Total Members", member.guild.members.cache.size)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());
}

client.login(token);