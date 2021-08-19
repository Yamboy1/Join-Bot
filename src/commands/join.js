import { on } from "events";

import { MessageActionRow, MessageSelectMenu, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import * as db from "../database/index.js";

export const data = 
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Setup joinbot")
    

export async function run(interaction) {
  if (interaction.guild === null) {
    await interaction.reply("This command can only be used in a server.");
    return;
  }
  
  if (!interaction.member.permissions.has("MANAGE_GUILD")) {
    await interaction.reply("You need to have the `Manage Server` permission to use this command.");
    return;
  }
    
  const channels =
    [...(await interaction.guild.channels.fetch())
      .filter(c => c.type === "GUILD_TEXT")
      .values()]

  let page = 1;
  const totalPages = Math.ceil(channels.length / 25)

  const components = generateMessageComponents();

  await interaction.reply({
    content: "Select a channel to setup joinbot in: ",
    components, ephemeral: true
  });

  for await (const [componentInteraction] of on(interaction.client, `interactionCreate:${interaction.id}`)) {
    if (componentInteraction.isSelectMenu()) {
      const [channelId] = componentInteraction.values;
      
      db.setJoinChannel(interaction.guildId, channelId);
      await componentInteraction.update({ content: `<#${channelId}> has now been set as the join channel.`, components: [] });
      break;
    }

    if (componentInteraction.isButton()) {
      switch (componentInteraction.customId) {
        case "previousButton": page--; break;
        case "nextButton":     page++; break;
      }

      const components = generateMessageComponents();
      await componentInteraction.update({ components });
    }
  }

  function generateMessageComponents() {
    const options =
      channels
        .slice((page - 1) * 25, page*25)
        .map(c => ({ label: `#${c.name}`, value: c.id, description: c.parent?.name }));

    return [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select")
          .setPlaceholder(`Select a channel. (Page ${page} of ${totalPages})`)
          .addOptions(options)
      ),

      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId("previousButton")
          .setDisabled(page <= 1)
          .setLabel("Previous page")
          .setEmoji("⬅")
          .setStyle("SECONDARY"),

        new MessageButton()
          .setCustomId("nextButton")
          .setDisabled(page >= totalPages)
          .setLabel("Next page")
          .setEmoji("➡")
          .setStyle("SECONDARY"),
      ])
    ];
  }
}