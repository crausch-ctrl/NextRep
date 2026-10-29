const sqlite3 = require("sqlite3").verbose();

// Connect to the NextRep database
const db = new sqlite3.Database("./nextrep.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the NextRep database.");
  }
});

// Create the users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('player', 'coach')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("Error creating users table:", err.message);
  } else {
    console.log("Users table is ready.");
  }
});

// Create the player_profiles table (same columns as Thomas's schema)
db.run(`
  CREATE TABLE IF NOT EXISTS player_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    jersey_number INTEGER,
    position TEXT,
    weight NUMERIC,
    height NUMERIC,
    class_year TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) {
    console.error("Error creating player_profiles table:", err.message);
  } else {
    console.log("Player profiles table is ready.");
  }
});

module.exports = db;
