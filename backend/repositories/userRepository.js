const db = require("../database");

// Insert a new user and return the new id
function createUser(firstName, lastName, email, passwordHash, role) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (first_name, last_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [firstName, lastName, email, passwordHash, role], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
}

// Find one user by email (returns undefined if none)
function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { createUser, findByEmail };
