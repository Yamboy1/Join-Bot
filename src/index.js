import { Client } from "discord.js";

import { log } from "./util/logger.js";
import * as config from "./util/config.js";
import * as events from "./events/index.js";

const client = new Client({ intents: ["GUILD_MEMBERS", "GUILDS"], partials: ["GUILD_MEMBER"] });

client.once('ready', () => {
	log(`Bot running as ${client.user.tag} in ${client.guilds.cache.size} guilds.`);
});

for (const event of Object.values(events)) {
  client.on(event.name, event.handler);
}

log("Starting...");

client.login(config.getToken());