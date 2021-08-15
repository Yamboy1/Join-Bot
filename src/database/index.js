import Database from "better-sqlite3";

import * as statements from "./sql_statements.js";

const db = new Database("join-bot.db");

statements.createTableStatement(db).run();

export function setJoinChannel(guildId, channelId) {
  return statements.insertStatement(db).run(guildId, channelId);
}

export function getJoinChannel(guildId) {
   const id = statements.selectStatement(db).get(guildId)?.channel_id ?? null;
   console.log("a", id)
   return id
}

export function removeJoinChannel(guildId) {
  return statements.deleteStatement(db).run(guildId);
}