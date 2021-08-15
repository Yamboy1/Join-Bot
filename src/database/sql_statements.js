export function createTableStatement(db) { 
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS guilds (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id   TEXT    NOT NULL UNIQUE,
      channel_id TEXT    NOT NULL UNIQUE
    );
  `);
}

export function insertStatement(db) { 
  return db.prepare(`
    INSERT INTO guilds (guild_id, channel_id)
      VALUES (?, ?)
      ON CONFLICT(guild_id)
      DO UPDATE SET channel_id = excluded.channel_id;
  `);
}

export function selectStatement(db) {
  return db.prepare(`
    SELECT channel_id FROM guilds WHERE guild_id = ?
  `);
}

export function deleteStatement(db) { 
  return db.prepare(`
    DELETE from guilds WHERE guild_id = ?
  `);
}