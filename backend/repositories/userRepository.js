const { db } = require("../database");

// ------------------------------------
// Create a new user
// ------------------------------------

async function createUser(
  firstName,
  lastName,
  email,
  passwordHash,
  role
) {
  const sql = `
    INSERT INTO users
    (
      first_name,
      last_name,
      email,
      password_hash,
      role
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  const result = await db.query(
    sql,
    [
      firstName,
      lastName,
      email,
      passwordHash,
      role
    ]
  );

  return {
    id: result.rows[0].id
  };
}


// ------------------------------------
// Find user by email
// ------------------------------------

async function findByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE LOWER(email) = LOWER($1)
  `;

  const result = await db.query(
    sql,
    [email]
  );

  return result.rows[0];
}


// ------------------------------------
// Find user by ID
// ------------------------------------

async function findById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  const result = await db.query(
    sql,
    [id]
  );

  return result.rows[0];
}


// ------------------------------------
// Exports
// ------------------------------------

module.exports = {
  createUser,
  findByEmail,
  findById
};