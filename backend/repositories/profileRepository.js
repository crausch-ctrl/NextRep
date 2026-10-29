const db = require("../database");

// Get the profile for one user (undefined if they haven't made one yet)
function findByUserId(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM player_profiles WHERE user_id = ?", [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Create the profile if it doesn't exist, otherwise update it
function saveProfile(userId, profile) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO player_profiles (user_id, jersey_number, position, weight, height, class_year)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        jersey_number = excluded.jersey_number,
        position = excluded.position,
        weight = excluded.weight,
        height = excluded.height,
        class_year = excluded.class_year
    `;
    const params = [
      userId,
      profile.jerseyNumber,
      profile.position,
      profile.weight,
      profile.height,
      profile.classYear,
    ];
    db.run(sql, params, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { findByUserId, saveProfile };
