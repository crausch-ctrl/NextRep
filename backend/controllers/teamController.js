const teamService =
  require("../services/teamService");

async function createTeam(req, res) {
  try {
    const { name, sport } = req.body;

    const team =
      await teamService.createTeam(
        req.user.id,
        name,
        sport
      );

    res.status(201).json({
      message: "Team created",
      team
    });

  } catch (err) {
    if (!err.status) {
      console.error(err);
    }

    res.status(
      err.status || 500
    ).json({
      error:
        err.status
          ? err.message
          : "Server error"
    });
  }
}

async function getMyTeams(req, res) {
  try {
    const teams =
      await teamService.getMyTeams(
        req.user.id
      );

    res.json({
      teams
    });

  } catch (err) {
    if (!err.status) {
      console.error(err);
    }

    res.status(
      err.status || 500
    ).json({
      error:
        err.status
          ? err.message
          : "Server error"
    });
  }
}

async function inviteToTeam(req, res) {
  try {
    const teamId =
      Number(req.params.teamId);

    if (!Number.isInteger(teamId)) {
      return res.status(400).json({
        error: "Invalid team id"
      });
    }

    const invitation =
      await teamService.inviteToTeam(
        req.user.id,
        teamId,
        req.body.email
      );

    res.status(201).json({
      message: "Invitation created",
      invitation
    });

  } catch (err) {
    if (!err.status) {
      console.error(err);
    }

    res.status(
      err.status || 500
    ).json({
      error:
        err.status
          ? err.message
          : "Server error"
    });
  }
}

async function getMyInvitations(req, res) {
  try {
    const invitations =
      await teamService.getMyInvitations(
        req.user.id
      );

    res.json({
      invitations
    });

  } catch (err) {
    if (!err.status) {
      console.error(err);
    }

    res.status(
      err.status || 500
    ).json({
      error:
        err.status
          ? err.message
          : "Server error"
    });
  }
}

async function acceptInvitation(req, res) {
  try {
    const inviteId =
      Number(req.params.inviteId);

    if (!Number.isInteger(inviteId)) {
      return res.status(400).json({
        error: "Invalid invitation id"
      });
    }

    const result =
      await teamService.acceptInvitation(
        req.user.id,
        inviteId
      );

    res.json({
      message: "Invitation accepted",
      result
    });

  } catch (err) {
    if (!err.status) {
      console.error(err);
    }

    res.status(
      err.status || 500
    ).json({
      error:
        err.status
          ? err.message
          : "Server error"
    });
  }
}

async function getTeamMembers(req, res) {
  try {
    const teamId =
      Number(req.params.teamId);

    if (!Number.isInteger(teamId)) {
      return res.status(400).json({
        error: "Invalid team id"
      });
    }

    const members =
      await teamService.getTeamMembers(
        req.user.id,
        teamId
      );

    res.json({
      members
    });

  } catch (err) {
    if (!err.status) {
      console.error(err);
    }

    res.status(
      err.status || 500
    ).json({
      error:
        err.status
          ? err.message
          : "Server error"
    });
  }
}

module.exports = {
  createTeam,
  getMyTeams,
  inviteToTeam,
  getMyInvitations,
  acceptInvitation,
  getTeamMembers
};