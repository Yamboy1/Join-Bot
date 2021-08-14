import { mkdir } from "fs/promises";

const map = new Map()

export function setJoinChannel(guildId, channelId) {
  map.set(guildId, channelId);
}

export function getJoinChannel(guildId) {
   return map.get(guildId) ?? null;
}

export function removeJoinChannel(guildId) {
  return map.delete(guildId);
}