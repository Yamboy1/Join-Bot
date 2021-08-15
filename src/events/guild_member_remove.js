import { MessageEmbed } from "discord.js";

import * as db from "../util/database.js";

export const name = "guildMemberRemove";

export async function handler(member) {
  const joinChannelId = db.getJoinChannel(member.guild.id);
  const channel = await member.guild.channels.fetch(joinChannelId);
  if (!channel) return;
  embed = new MessageEmbed()
    .setTitle(`${member.displayName} Left ${member.guild.name}`)
    .setColor(0xFF0000)
    .setDescription("Cya")
    .addField("Total Members", member.guild.memberCount)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL());

    await channel.send({ embeds: [embed] });
}