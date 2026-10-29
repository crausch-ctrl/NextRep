const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Use the ONE shared NextRep database
const dbPath = path.join(__dirname, "../database/nextrep.db");

// Use Thomas's full 8-table schema
const schemaPath = path.join(__dirname, "../database/schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the NextRep database.");
  }
});

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    let schema;

    try {
      schema = fs.readFileSync(schemaPath, "utf8");
    } catch (err) {
      console.error("Could not read database/schema.sql:", err.message);
      return reject(err);
    }

    db.serialize(() => {
      // SQLite does not always enforce foreign keys unless this is enabled
      db.run("PRAGMA foreign_keys = ON", (err) => {
        if (err) {
          console.error("Could not enable foreign keys:", err.message);
          return reject(err);
        }

        // Run the full schema
        db.exec(schema, (err) => {
          if (err) {
            console.error("Could not initialize database schema:", err.message);
            return reject(err);
          }

          console.log("NextRep database schema is ready.");
          resolve();
        });
      });
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
};