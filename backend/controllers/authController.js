const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await authService.register(firstName, lastName, email, password, role);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : "Server error" });
  }
}

module.exports = { register, login };
