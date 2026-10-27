const profileRepo = require("../repositories/profileRepository");

// Same helper idea as authService, so the controller knows the HTTP status
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Turn the database row into the shape the frontend will use
function formatProfile(row) {
  return {
    userId: row.user_id,
    jerseyNumber: row.jersey_number,
    position: row.position,
    weight: row.weight,
    height: row.height,
    classYear: row.class_year,
  };
}

async function getProfile(userId) {
  const row = await profileRepo.findByUserId(userId);
  if (!row) {
    throw httpError(404, "No profile yet");
  }
  return formatProfile(row);
}

async function saveProfile(userId, body) {
  // missing fields become null so the database doesn't choke on undefined
  const jerseyNumber = body.jerseyNumber ?? null;
  const position = body.position ?? null;
  const weight = body.weight ?? null;
  const height = body.height ?? null;
  const classYear = body.classYear ?? null;

  if (jerseyNumber !== null && (!Number.isInteger(jerseyNumber) || jerseyNumber < 0 || jerseyNumber > 99)) {
    throw httpError(400, "Jersey number must be a whole number from 0 to 99");
  }
  if (weight !== null && (typeof weight !== "number" || weight <= 0)) {
    throw httpError(400, "Weight must be a positive number");
  }
  if (height !== null && (typeof height !== "number" || height <= 0)) {
    throw httpError(400, "Height must be a positive number");
  }

  await profileRepo.saveProfile(userId, { jerseyNumber, position, weight, height, classYear });
  return getProfile(userId);
}

module.exports = { getProfile, saveProfile };
