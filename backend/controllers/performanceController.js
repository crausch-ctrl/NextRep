const performanceService =
  require("../services/performanceService");


async function getMyResults(req, res) {
  try {
    const results =
      await performanceService.getMyResults(
        req.user.id
      );

    res.json({
      results
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


async function logResult(req, res) {
  try {
    const result =
      await performanceService.logResult(
        req.user.id,
        req.body.metric,
        req.body.value
      );

    res.status(201).json({
      message: "Result saved",
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


async function getMyGoals(req, res) {
  try {
    const goals =
      await performanceService.getMyGoals(
        req.user.id
      );

    res.json({
      goals
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


async function saveGoal(req, res) {
  try {
    const goal =
      await performanceService.saveGoal(
        req.user.id,
        req.body.metric,
        req.body.targetValue
      );

    res.json({
      message: "Goal saved",
      goal
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
  getMyResults,
  logResult,
  getMyGoals,
  saveGoal
};