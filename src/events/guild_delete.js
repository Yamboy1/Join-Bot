import * as db from "../util/database.js";

export const name = "guildDelete";

export async function handler(guild) {
  db.removeJoinChannel(guild.id);
}