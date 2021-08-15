import * as db from "../database/index.js";

export const name = "guildDelete";

export async function handler(guild) {
  db.removeJoinChannel(guild.id);
}