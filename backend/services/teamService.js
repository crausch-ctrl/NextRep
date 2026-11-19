const teamRepo =
  require("../repositories/teamRepository");

const userRepo =
  require("../repositories/userRepository");

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}


// ------------------------------------
// Create team
// ------------------------------------

async function createTeam(
  coachId,
  name,
  sport
) {
  if (!name || !name.trim()) {
    throw httpError(
      400,
      "Team name is required"
    );
  }

  const cleanName = name.trim();

  const cleanSport =
    sport && sport.trim()
      ? sport.trim()
      : null;

  let result;

  try {
    result =
      await teamRepo.createTeam(
        cleanName,
        cleanSport
      );

  } catch (err) {

    // PostgreSQL unique constraint error
    if (err.code === "23505") {
      throw httpError(
        409,
        "A team with that name already exists"
      );
    }

    throw err;
  }

  await teamRepo.addMembership(
    coachId,
    result.id
  );

  return {
    id: result.id,
    name: cleanName,
    sport: cleanSport
  };
}


// ------------------------------------
// Get user's teams
// ------------------------------------

async function getMyTeams(userId) {
  return teamRepo.findTeamsForUser(
    userId
  );
}


// ------------------------------------
// Invite player to team
// ------------------------------------

async function inviteToTeam(
  coachId,
  teamId,
  email
) {
  if (!email || !email.trim()) {
    throw httpError(
      400,
      "Email is required"
    );
  }

  const cleanEmail =
    email.trim().toLowerCase();

  const team =
    await teamRepo.findTeamById(
      teamId
    );

  if (!team) {
    throw httpError(
      404,
      "Team not found"
    );
  }

  const coachMembership =
    await teamRepo.findMembership(
      coachId,
      teamId
    );

  if (!coachMembership) {
    throw httpError(
      403,
      "You are not a member of this team"
    );
  }

  const existingInvite =
    await teamRepo.findActiveInvitation(
      teamId,
      cleanEmail
    );

  if (existingInvite) {
    throw httpError(
      409,
      "That person already has a pending invitation"
    );
  }

  const existingUser =
    await userRepo.findByEmail(
      cleanEmail
    );

  if (existingUser) {
    const membership =
      await teamRepo.findMembership(
        existingUser.id,
        teamId
      );

    if (membership) {
      throw httpError(
        409,
        "That user is already on this team"
      );
    }
  }

  // Invitation expires 7 days from now
  const expiresAt =
    new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    );

  const result =
    await teamRepo.createInvitation(
      teamId,
      cleanEmail,
      coachId,
      expiresAt
    );

  return {
    id: result.id,
    teamId,
    teamName: team.name,
    email: cleanEmail,
    status: "pending",
    expiresAt
  };
}


// ------------------------------------
// Get user's invitations
// ------------------------------------

async function getMyInvitations(userId) {
  const user =
    await userRepo.findById(
      userId
    );

  if (!user) {
    throw httpError(
      404,
      "User not found"
    );
  }

  return teamRepo.findInvitationsForEmail(
    user.email
  );
}


// ------------------------------------
// Accept invitation
// ------------------------------------

async function acceptInvitation(
  userId,
  inviteId
) {
  const user =
    await userRepo.findById(
      userId
    );

  if (!user) {
    throw httpError(
      404,
      "User not found"
    );
  }

  const invitation =
    await teamRepo.findPendingInvitation(
      inviteId,
      user.email
    );

  if (!invitation) {
    throw httpError(
      404,
      "Invitation not found or expired"
    );
  }

  const existingMembership =
    await teamRepo.findMembership(
      userId,
      invitation.team_id
    );

  if (existingMembership) {
    throw httpError(
      409,
      "You are already on this team"
    );
  }

  await teamRepo.acceptInvitation(
    inviteId,
    userId,
    invitation.team_id
  );

  return {
    teamId:
      invitation.team_id,

    status:
      "accepted"
  };
}


// ------------------------------------
// Get team members
// ------------------------------------

async function getTeamMembers(
  coachId,
  teamId
) {
  const team =
    await teamRepo.findTeamById(
      teamId
    );

  if (!team) {
    throw httpError(
      404,
      "Team not found"
    );
  }

  const membership =
    await teamRepo.findMembership(
      coachId,
      teamId
    );

  if (!membership) {
    throw httpError(
      403,
      "You are not a member of this team"
    );
  }

  return teamRepo.findTeamMembers(
    teamId
  );
}


module.exports = {
  createTeam,
  getMyTeams,
  inviteToTeam,
  getMyInvitations,
  acceptInvitation,
  getTeamMembers
};