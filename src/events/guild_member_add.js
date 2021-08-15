import { MessageEmbed } from "discord.js";

import * as db from "../util/database.js";

export const name = "guildMemberAdd";

export async function handler(member) {
  const joinChannelId = db.getJoinChannel(member.guild.id);
  const channel = await member.guild.channels.fetch(joinChannelId);
  if (!channel) return;

  const guild = await member.guild.fetch()
  console.log(guild.memberCount);

  const embed = new MessageEmbed()
    .setTitle(`Welcome ${member.displayName} To ${member.guild.name}`)
    .setColor(0x008000)
    .setDescription(`Welcome To ${guild.name}`)
    .addField("Time Joined:", member.joinedAt.toUTCString())
    .addField("Account Creation Date", member.user.createdAt.toUTCString())
    .addField("Total Members", `${guild.memberCount}`)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());

    await channel.send({ embeds: [embed] });
}