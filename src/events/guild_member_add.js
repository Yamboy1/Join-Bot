import { MessageEmbed } from "discord.js";

import * as db from "../database/index.js";

export const name = "guildMemberAdd";

export async function handler(member) {
  const joinChannelId = db.getJoinChannel(member.guild.id);
  if (!joinChannelId) return;
  const channel = await member.guild.channels.fetch(joinChannelId);
  console.log(channel.id);
  if (!channel) return;


  const guild = await member.guild.fetch()

  const embed = new MessageEmbed()
    .setTitle(`Welcome ${member.displayName} To ${guild.name}`)
    .setColor(0x008000)
    .setDescription(`Welcome To ${guild.name}`)
    .addField("Time Joined:", member.joinedAt.toUTCString())
    .addField("Account Creation Date", member.user.createdAt.toUTCString())
    .addField("Total Members", `${guild.memberCount}`)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());

    await channel.send({ embeds: [embed] });
}