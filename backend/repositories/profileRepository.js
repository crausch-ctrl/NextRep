const { db } = require("../database");

// ------------------------------------
// Find a player's profile by user ID
// ------------------------------------

async function findByUserId(userId) {
  const result = await db.query(
    `
    SELECT *
    FROM player_profiles
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
}


// ------------------------------------
// Create or update a player's profile
// ------------------------------------

async function saveProfile(
  userId,
  profile
) {
  const sql = `
    INSERT INTO player_profiles
    (
      user_id,
      jersey_number,
      position,
      weight,
      height,
      class_year
    )

    VALUES ($1, $2, $3, $4, $5, $6)

    ON CONFLICT (user_id)

    DO UPDATE SET
      jersey_number = EXCLUDED.jersey_number,
      position = EXCLUDED.position,
      weight = EXCLUDED.weight,
      height = EXCLUDED.height,
      class_year = EXCLUDED.class_year
  `;

  await db.query(
    sql,
    [
      userId,
      profile.jerseyNumber,
      profile.position,
      profile.weight,
      profile.height,
      profile.classYear
    ]
  );
}


// ------------------------------------
// Exports
// ------------------------------------

module.exports = {
  findByUserId,
  saveProfile
};