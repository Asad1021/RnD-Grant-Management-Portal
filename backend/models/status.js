const { queryDatabase } = require("../database");

// to update the status of a specific project
async function updatestatus(req) {
  try {
    query = "UPDATE projects SET is_running = $1 where project_id = $2";
    await queryDatabase(query, [req.body.ans, req.body.p_id]);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

module.exports = { updatestatus };
