const profileService = require("../services/profileService");

async function getProfile(req, res) {
  try {
    // req.user comes from the token, so players can only see their own profile
    const profile = await profileService.getProfile(req.user.id);
    res.json({ profile });
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : "Server error" });
  }
}

async function saveProfile(req, res) {
  try {
    const profile = await profileService.saveProfile(req.user.id, req.body);
    res.json({ message: "Profile saved", profile });
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : "Server error" });
  }
}

module.exports = { getProfile, saveProfile };
