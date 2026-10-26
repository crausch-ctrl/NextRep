const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
