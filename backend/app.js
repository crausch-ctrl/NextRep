const express = require("express");
const cors = require("cors");

const authController = require("./controllers/authController");
const teamController = require("./controllers/teamController");

const { requireAuth, requireRole } = require("./middleware/auth");
const { initializeDatabase } = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// --------------------
// Health check
// --------------------

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


// --------------------
// Authentication
// --------------------

app.post(
  "/register",
  authController.register
);

app.post(
  "/login",
  authController.login
);


// --------------------
// Logged-in user
// --------------------

app.get(
  "/me",
  requireAuth,
  (req, res) => {
    res.json({
      user: req.user
    });
  }
);



// --------------------
// Team routes
// --------------------

// Coach creates a team
app.post(
  "/teams",
  requireAuth,
  requireRole("coach"),
  teamController.createTeam
);


// Logged-in user gets their teams
app.get(
  "/teams/mine",
  requireAuth,
  teamController.getMyTeams
);


// Coach invites someone to a team
app.post(
  "/teams/:teamId/invitations",
  requireAuth,
  requireRole("coach"),
  teamController.inviteToTeam
);


// Logged-in user sees invitations
app.get(
  "/invitations/mine",
  requireAuth,
  teamController.getMyInvitations
);


// User accepts an invitation
app.post(
  "/invitations/:inviteId/accept",
  requireAuth,
  teamController.acceptInvitation
);


// Coach sees members of a team
app.get(
  "/teams/:teamId/members",
  requireAuth,
  requireRole("coach"),
  teamController.getTeamMembers
);


// --------------------
// Start server
// --------------------

initializeDatabase()
  .then(() => {
    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `NextRep server running on port ${PORT}`
        );
      }
    );
  })
  .catch((err) => {
    console.error(
      "Failed to initialize database:",
      err
    );

    process.exit(1);
  });