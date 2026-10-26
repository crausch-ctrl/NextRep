const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || "nextrep-dev-secret";

// Small helper so the controller knows which HTTP status to send
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function register(firstName, lastName, email, password, role) {
  if (!firstName || !lastName || !email || !password || !role) {
    throw httpError(400, "All fields are required");
  }
  if (role !== "player" && role !== "coach") {
    throw httpError(400, "Role must be player or coach");
  }
  if (password.length < 8) {
    throw httpError(400, "Password must be at least 8 characters");
  }

  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw httpError(409, "Email already registered");
  }

  // never store the real password, only the hash
  const passwordHash = await bcrypt.hash(password, 10);
  const { id } = await userRepo.createUser(firstName, lastName, email, passwordHash, role);

  return { id, firstName, lastName, email, role };
}

async function login(email, password) {
  if (!email || !password) {
    throw httpError(400, "Email and password are required");
  }

  const user = await userRepo.findByEmail(email);
  // same message for both failures so nobody can tell which part was wrong
  if (!user) {
    throw httpError(401, "Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw httpError(401, "Invalid email or password");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

  return {
    token,
    user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role },
  };
}

module.exports = { register, login, JWT_SECRET };
