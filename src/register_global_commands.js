import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { log } from "./util/logger.js";
import * as config from "./util/config.js";
import * as commands from "./commands/index.js";

const rest = new REST({ version: '9' }).setToken(config.getToken());

try {
  log("Started refreshing global application commands");

  await rest.put(
    Routes.applicationCommands(config.getAppId(), config.getTestingGuildId()),
    { body: Object.values(commands).map(command => command.data.toJSON()) }
  );

  log("Successfully reloaded global application commands");
} catch (e) {
  log(e);
}