const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
