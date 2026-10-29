const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");
const profileController = require("./controllers/profileController");
const { requireAuth, requireRole } = require("./middleware/auth");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth routes
app.post("/register", authController.register);
app.post("/login", authController.login);

// Protected route: only works with a valid token
app.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Coach-only route: valid token AND role must be coach
app.get("/coach-only", requireAuth, requireRole("coach"), (req, res) => {
  res.json({ message: "Welcome, coach!" });
});

// Player profile routes: valid token AND role must be player
app.get("/profile", requireAuth, requireRole("player"), profileController.getProfile);
app.put("/profile", requireAuth, requireRole("player"), profileController.saveProfile);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
