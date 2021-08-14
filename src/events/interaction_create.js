import * as joinCommand from "../commands/join.js";

export const name = "interactionCreate";

export async function handler(interaction) {
	if (interaction.isCommand()) {
    if (interaction.commandName === joinCommand.data.name) {
      await joinCommand.run(interaction);
    }
  } else {
    if (interaction.isMessageComponent()) {
      interaction.client.emit(`interactionCreate:${interaction.message.interaction.id}`, interaction);
    }
  }
}
