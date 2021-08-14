import { writeFileSync } from "fs";

export function log(message) {
  writeFileSync("./log.txt", `[${new Date().toISOString()}] ${message}\n`, { flag: "a"});
  console.log(message);
}