const { readFileSync, writeFileSync } = require("fs");
require("dotenv").config()
const { Client } = require("discord.js");
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
  let channel;
  (channel = getJoinChannel(member.guild)) && channel.send("Someone joined")
})

client.on("guildMemberRemove", member => {
  let channel;
  (channel = getJoinChannel(member.guild)) && channel.send("Someone left")
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

client.login(process.env.TOKEN);