import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import * as config from "./util/config.js";
import * as joinCommand from "./commands/join.js";

const rest = new REST({ version: '9' }).setToken(config.getToken());

try {
  console.log("Started refreshing application commands");

  await rest.put(
    Routes.applicationGuildCommands(config.getAppId(), config.getTestingGuildId()),
    { body: [joinCommand.data.toJSON()] }
  );

  console.log("Successfully reloaded application commands");
} catch (e) {
  console.log(e);
}