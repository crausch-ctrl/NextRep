const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

// Render stores the PostgreSQL connection
// information in DATABASE_URL.
const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL environment variable is missing."
  );

  process.exit(1);
}

// Create the PostgreSQL connection pool.
const db = new Pool({
  connectionString
});

// Our SQL schema file.
const schemaPath = path.join(
  __dirname,
  "../database/schema.sql"
);

// Log database connection problems.
db.on("error", (err) => {
  console.error(
    "PostgreSQL database error:",
    err.message
  );
});

// Create the database tables when
// the backend starts.
async function initializeDatabase() {
  try {
    const schema =
      fs.readFileSync(
        schemaPath,
        "utf8"
      );

    await db.query(schema);

    console.log(
      "Connected to the NextRep PostgreSQL database."
    );

    console.log(
      "NextRep PostgreSQL schema is ready."
    );

  } catch (err) {
    console.error(
      "Could not initialize PostgreSQL database:",
      err
    );

    throw err;
  }
}

module.exports = {
  db,
  initializeDatabase
};