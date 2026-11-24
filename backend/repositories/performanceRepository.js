const { db } = require("../database");


// Find one metric by its name
async function findMetricByName(name) {
  const result = await db.query(
    `
    SELECT
      id,
      name,
      unit,
      better_direction
    FROM metrics
    WHERE name = $1
    `,
    [name]
  );

  return result.rows[0];
}


// Save a new player result
async function createResult(
  playerId,
  metricId,
  value
) {
  const result = await db.query(
    `
    INSERT INTO performance_results
    (
      player_id,
      metric_id,
      value,
      status
    )

    VALUES ($1, $2, $3, 'pending')

    RETURNING
      id,
      player_id,
      metric_id,
      value,
      status,
      recorded_at
    `,
    [
      playerId,
      metricId,
      value
    ]
  );

  return result.rows[0];
}


// Get all results for one player
async function findResultsForPlayer(playerId) {
  const result = await db.query(
    `
    SELECT
      performance_results.id,
      performance_results.value,
      performance_results.status,
      performance_results.recorded_at,

      metrics.name AS metric_name,
      metrics.unit,
      metrics.better_direction

    FROM performance_results

    JOIN metrics
      ON performance_results.metric_id =
         metrics.id

    WHERE performance_results.player_id = $1

    ORDER BY
      performance_results.recorded_at ASC,
      performance_results.id ASC
    `,
    [playerId]
  );

  return result.rows;
}


// Get the current goals for one player
async function findGoalsForPlayer(playerId) {
  const result = await db.query(
    `
    SELECT DISTINCT ON (goals.metric_id)

      goals.id,
      goals.target_value,
      goals.created_at,

      metrics.id AS metric_id,
      metrics.name AS metric_name,
      metrics.unit,
      metrics.better_direction

    FROM goals

    JOIN metrics
      ON goals.metric_id = metrics.id

    WHERE goals.player_id = $1

    ORDER BY
      goals.metric_id,
      goals.created_at DESC,
      goals.id DESC
    `,
    [playerId]
  );

  return result.rows;
}


// Find an existing goal
async function findGoal(
  playerId,
  metricId
) {
  const result = await db.query(
    `
    SELECT *
    FROM goals

    WHERE player_id = $1
    AND metric_id = $2

    ORDER BY
      created_at DESC,
      id DESC

    LIMIT 1
    `,
    [
      playerId,
      metricId
    ]
  );

  return result.rows[0];
}


// Create goal
async function createGoal(
  playerId,
  metricId,
  targetValue
) {
  const result = await db.query(
    `
    INSERT INTO goals
    (
      player_id,
      metric_id,
      target_value
    )

    VALUES ($1, $2, $3)

    RETURNING *
    `,
    [
      playerId,
      metricId,
      targetValue
    ]
  );

  return result.rows[0];
}


// Update goal
async function updateGoal(
  goalId,
  targetValue
) {
  const result = await db.query(
    `
    UPDATE goals

    SET
      target_value = $2,
      created_at = CURRENT_TIMESTAMP

    WHERE id = $1

    RETURNING *
    `,
    [
      goalId,
      targetValue
    ]
  );

  return result.rows[0];
}


module.exports = {
  findMetricByName,
  createResult,
  findResultsForPlayer,
  findGoalsForPlayer,
  findGoal,
  createGoal,
  updateGoal
};