const performanceRepo =
  require("../repositories/performanceRepository");


function httpError(status, message) {
  const err = new Error(message);
  err.status = status;

  return err;
}


function formatResult(row) {
  return {
    id: row.id,
    metric: row.metric_name,
    value: Number(row.value),
    status: row.status,
    recordedAt: row.recorded_at,
    unit: row.unit,
    betterDirection: row.better_direction
  };
}


function formatGoal(row) {
  return {
    id: row.id,
    metric: row.metric_name,
    targetValue: Number(row.target_value),
    unit: row.unit,
    betterDirection: row.better_direction
  };
}


// Get player's saved numbers
async function getMyResults(playerId) {
  const rows =
    await performanceRepo.findResultsForPlayer(
      playerId
    );

  return rows.map(formatResult);
}


// Save new number
async function logResult(
  playerId,
  metricName,
  value
) {
  const numberValue = Number(value);

  if (
    !metricName ||
    !Number.isFinite(numberValue) ||
    numberValue <= 0
  ) {
    throw httpError(
      400,
      "Metric and a positive result are required"
    );
  }

  const metric =
    await performanceRepo.findMetricByName(
      metricName
    );

  if (!metric) {
    throw httpError(
      400,
      "Unknown performance metric"
    );
  }

  const row =
    await performanceRepo.createResult(
      playerId,
      metric.id,
      numberValue
    );

  return formatResult({
    ...row,
    metric_name: metric.name,
    unit: metric.unit,
    better_direction:
      metric.better_direction
  });
}


// Get player's goals
async function getMyGoals(playerId) {
  const rows =
    await performanceRepo.findGoalsForPlayer(
      playerId
    );

  return rows.map(formatGoal);
}


// Create or update goal
async function saveGoal(
  playerId,
  metricName,
  targetValue
) {
  const numberValue =
    Number(targetValue);

  if (
    !metricName ||
    !Number.isFinite(numberValue) ||
    numberValue <= 0
  ) {
    throw httpError(
      400,
      "Metric and a positive goal are required"
    );
  }

  const metric =
    await performanceRepo.findMetricByName(
      metricName
    );

  if (!metric) {
    throw httpError(
      400,
      "Unknown performance metric"
    );
  }

  const existing =
    await performanceRepo.findGoal(
      playerId,
      metric.id
    );

  let row;

  if (existing) {
    row =
      await performanceRepo.updateGoal(
        existing.id,
        numberValue
      );
  } else {
    row =
      await performanceRepo.createGoal(
        playerId,
        metric.id,
        numberValue
      );
  }

  return formatGoal({
    ...row,
    metric_name: metric.name,
    unit: metric.unit,
    better_direction:
      metric.better_direction
  });
}


module.exports = {
  getMyResults,
  logResult,
  getMyGoals,
  saveGoal
};