import { readFile } from "fs/promises";

const config =
  await readFile("config.json")
    .then(json => JSON.parse(json));

export function getToken() {
  return config.token;
}

export function getAppId() {
  return config.appId;
}

export function getTestingGuildId() {
  return config.testingGuildId;
}