const { db } = require("../database");

function createTeam(name, sport) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO teams (name, sport)
      VALUES (?, ?)
    `;

    db.run(sql, [name, sport], function (err) {
      if (err) return reject(err);

      resolve({
        id: this.lastID
      });
    });
  });
}

function findTeamById(teamId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM teams WHERE id = ?",
      [teamId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

function addMembership(userId, teamId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT OR IGNORE INTO team_memberships
      (user_id, team_id)
      VALUES (?, ?)
    `;

    db.run(sql, [userId, teamId], function (err) {
      if (err) return reject(err);

      resolve({
        id: this.lastID
      });
    });
  });
}

function findMembership(userId, teamId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM team_memberships
      WHERE user_id = ?
      AND team_id = ?
    `;

    db.get(sql, [userId, teamId], (err, row) => {
      if (err) return reject(err);

      resolve(row);
    });
  });
}

function findTeamsForUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        teams.id,
        teams.name,
        teams.sport,
        teams.created_at
      FROM teams
      JOIN team_memberships
        ON teams.id = team_memberships.team_id
      WHERE team_memberships.user_id = ?
      ORDER BY teams.name
    `;

    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);

      resolve(rows);
    });
  });
}

function findActiveInvitation(teamId, email) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM invitations
      WHERE team_id = ?
      AND LOWER(email) = LOWER(?)
      AND status = 'pending'
      AND datetime(expires_at) > datetime('now')
    `;

    db.get(
      sql,
      [teamId, email],
      (err, row) => {
        if (err) return reject(err);

        resolve(row);
      }
    );
  });
}

function createInvitation(
  teamId,
  email,
  invitedBy,
  expiresAt
) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO invitations
      (
        team_id,
        email,
        invited_by,
        status,
        expires_at
      )
      VALUES (?, ?, ?, 'pending', ?)
    `;

    db.run(
      sql,
      [
        teamId,
        email,
        invitedBy,
        expiresAt
      ],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: this.lastID
        });
      }
    );
  });
}

function findInvitationsForEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `
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
        ON invitations.team_id = teams.id

      JOIN users
        ON invitations.invited_by = users.id

      WHERE LOWER(invitations.email) = LOWER(?)
      AND invitations.status = 'pending'
      AND datetime(invitations.expires_at) > datetime('now')

      ORDER BY invitations.created_at DESC
    `;

    db.all(sql, [email], (err, rows) => {
      if (err) return reject(err);

      resolve(rows);
    });
  });
}

function findPendingInvitation(inviteId, email) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM invitations
      WHERE id = ?
      AND LOWER(email) = LOWER(?)
      AND status = 'pending'
      AND datetime(expires_at) > datetime('now')
    `;

    db.get(
      sql,
      [inviteId, email],
      (err, row) => {
        if (err) return reject(err);

        resolve(row);
      }
    );
  });
}

function acceptInvitation(
  inviteId,
  userId,
  teamId
) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run(
        `
        INSERT OR IGNORE INTO team_memberships
        (user_id, team_id)
        VALUES (?, ?)
        `,
        [userId, teamId],
        (membershipError) => {
          if (membershipError) {
            db.run("ROLLBACK");
            return reject(membershipError);
          }

          db.run(
            `
            UPDATE invitations
            SET status = 'accepted'
            WHERE id = ?
            `,
            [inviteId],
            (inviteError) => {
              if (inviteError) {
                db.run("ROLLBACK");
                return reject(inviteError);
              }

              db.run(
                "COMMIT",
                (commitError) => {
                  if (commitError) {
                    return reject(commitError);
                  }

                  resolve();
                }
              );
            }
          );
        }
      );
    });
  });
}

function findTeamMembers(teamId) {
  return new Promise((resolve, reject) => {
    const sql = `
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
        ON team_memberships.user_id = users.id

      LEFT JOIN player_profiles
        ON users.id = player_profiles.user_id

      WHERE team_memberships.team_id = ?

      ORDER BY users.last_name, users.first_name
    `;

    db.all(
      sql,
      [teamId],
      (err, rows) => {
        if (err) return reject(err);

        resolve(rows);
      }
    );
  });
}

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