const { db } = require("../database");

// ------------------------------------
// Create a team
// ------------------------------------

async function createTeam(name, sport) {
  const result = await db.query(
    `
    INSERT INTO teams
    (
      name,
      sport
    )
    VALUES ($1, $2)
    RETURNING id
    `,
    [name, sport]
  );

  return {
    id: result.rows[0].id
  };
}


// ------------------------------------
// Find a team by ID
// ------------------------------------

async function findTeamById(teamId) {
  const result = await db.query(
    `
    SELECT *
    FROM teams
    WHERE id = $1
    `,
    [teamId]
  );

  return result.rows[0];
}


// ------------------------------------
// Add user to a team
// ------------------------------------

async function addMembership(
  userId,
  teamId
) {
  const result = await db.query(
    `
    INSERT INTO team_memberships
    (
      user_id,
      team_id
    )
    VALUES ($1, $2)

    ON CONFLICT (user_id, team_id)
    DO NOTHING

    RETURNING id
    `,
    [
      userId,
      teamId
    ]
  );

  return {
    id:
      result.rows.length > 0
        ? result.rows[0].id
        : null
  };
}


// ------------------------------------
// Find membership
// ------------------------------------

async function findMembership(
  userId,
  teamId
) {
  const result = await db.query(
    `
    SELECT *
    FROM team_memberships
    WHERE user_id = $1
    AND team_id = $2
    `,
    [
      userId,
      teamId
    ]
  );

  return result.rows[0];
}


// ------------------------------------
// Find all teams for one user
// ------------------------------------

async function findTeamsForUser(userId) {
  const result = await db.query(
    `
    SELECT
      teams.id,
      teams.name,
      teams.sport,
      teams.created_at

    FROM teams

    JOIN team_memberships
      ON teams.id =
         team_memberships.team_id

    WHERE team_memberships.user_id = $1

    ORDER BY teams.name
    `,
    [userId]
  );

  return result.rows;
}


// ------------------------------------
// Find active invitation
// ------------------------------------

async function findActiveInvitation(
  teamId,
  email
) {
  const result = await db.query(
    `
    SELECT *
    FROM invitations

    WHERE team_id = $1

    AND LOWER(email) =
        LOWER($2)

    AND status = 'pending'

    AND expires_at >
        CURRENT_TIMESTAMP
    `,
    [
      teamId,
      email
    ]
  );

  return result.rows[0];
}


// ------------------------------------
// Create invitation
// ------------------------------------

async function createInvitation(
  teamId,
  email,
  invitedBy,
  expiresAt
) {
  const result = await db.query(
    `
    INSERT INTO invitations
    (
      team_id,
      email,
      invited_by,
      status,
      expires_at
    )

    VALUES (
      $1,
      $2,
      $3,
      'pending',
      $4
    )

    RETURNING id
    `,
    [
      teamId,
      email,
      invitedBy,
      expiresAt
    ]
  );

  return {
    id: result.rows[0].id
  };
}


// ------------------------------------
// Find invitations for an email
// ------------------------------------

async function findInvitationsForEmail(
  email
) {
  const result = await db.query(
    `
    SELECT
      invitations.id,
      invitations.team_id,
      invitations.email,
      invitations.status,
      invitations.created_at,
      invitations.expires_at,

      teams.name AS team_name,
      teams.sport AS team_sport,

      users.first_name AS coach_first_name,
      users.last_name AS coach_last_name

    FROM invitations

    JOIN teams
      ON invitations.team_id =
         teams.id

    JOIN users
      ON invitations.invited_by =
         users.id

    WHERE LOWER(invitations.email) =
          LOWER($1)

    AND invitations.status =
        'pending'

    AND invitations.expires_at >
        CURRENT_TIMESTAMP

    ORDER BY
      invitations.created_at DESC
    `,
    [email]
  );

  return result.rows;
}


// ------------------------------------
// Find pending invitation
// ------------------------------------

async function findPendingInvitation(
  inviteId,
  email
) {
  const result = await db.query(
    `
    SELECT *
    FROM invitations

    WHERE id = $1

    AND LOWER(email) =
        LOWER($2)

    AND status = 'pending'

    AND expires_at >
        CURRENT_TIMESTAMP
    `,
    [
      inviteId,
      email
    ]
  );

  return result.rows[0];
}


// ------------------------------------
// Accept invitation
// ------------------------------------

async function acceptInvitation(
  inviteId,
  userId,
  teamId
) {
  const client =
    await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO team_memberships
      (
        user_id,
        team_id
      )
      VALUES ($1, $2)

      ON CONFLICT (user_id, team_id)
      DO NOTHING
      `,
      [
        userId,
        teamId
      ]
    );

    await client.query(
      `
      UPDATE invitations
      SET status = 'accepted'
      WHERE id = $1
      `,
      [inviteId]
    );

    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");

    throw err;

  } finally {
    client.release();
  }
}


// ------------------------------------
// Get team members
// ------------------------------------

async function findTeamMembers(teamId) {
  const result = await db.query(
    `
    SELECT
      users.id,
      users.first_name,
      users.last_name,
      users.email,
      users.role,

      player_profiles.jersey_number,
      player_profiles.position,
      player_profiles.class_year

    FROM team_memberships

    JOIN users
      ON team_memberships.user_id =
         users.id

    LEFT JOIN player_profiles
      ON users.id =
         player_profiles.user_id

    WHERE team_memberships.team_id = $1

    ORDER BY
      users.last_name,
      users.first_name
    `,
    [teamId]
  );

  return result.rows;
}


// ------------------------------------
// Exports
// ------------------------------------

module.exports = {
  createTeam,
  findTeamById,
  addMembership,
  findMembership,
  findTeamsForUser,
  findActiveInvitation,
  createInvitation,
  findInvitationsForEmail,
  findPendingInvitation,
  acceptInvitation,
  findTeamMembers
};