import * as commands from "../commands/index.js";

const commandMap = new Map()

for (const command of Object.values(commands)) {
  commandMap.set(command.data.name, command.run);
}

export const name = "interactionCreate";

export async function handler(interaction) {
	if (interaction.isCommand()) {
    console.log(commandMap, commandMap.get(interaction.commandName));
    await commandMap.get(interaction.commandName)?.(interaction);
  } else if (interaction.isMessageComponent()) {
    interaction.client.emit(`interactionCreate:${interaction.message.interaction.id}`, interaction);
  }
}
