import { MessageEmbed } from "discord.js";

import * as db from "../util/database.js";

export const name = "guildMemberRemove";

export async function handler(member) {
  const joinChannelId = db.getJoinChannel(member.guild.id);
  if (!joinChannelId) return;
  const channel = await member.guild.channels.fetch(joinChannelId);
  console.log(channel.id);
  if (!channel) return;

  const guild = await member.guild.fetch();
  console.log(guild.name, guild.memberCount)

  const embed = new MessageEmbed()
    .setTitle(`${member.displayName} Left ${guild.name}`)
    .setColor(0xFF0000)
    .setDescription("Cya")
    .addField("Total Members", `${guild.memberCount}`)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());

    await channel.send({ embeds: [embed] });
}