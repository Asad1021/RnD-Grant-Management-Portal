const { queryDatabase } = require("../database");

async function addfellow(req) {
  try {
    const insertProfProjectQuery = `
      INSERT INTO user_project 
      (email_id, project_id) 
      VALUES ($1, $2)
    `;
    await queryDatabase(insertProfProjectQuery, [
      req.body.email_id,
      req.body.project_id,
    ]);

    // Fetching all fellow emails inserted for the specified project_id.
    const fellowQuery = `SELECT up.email_id
    FROM user_project up
    JOIN users u ON up.email_id = u.email_id
    WHERE up.project_id = $1 AND u.admin = 3;`;

    // const fellowQuery = `
    //   SELECT email_id
    //   FROM user_project
    //   WHERE project_id = $1
    // `;
    const fellowResult = await queryDatabase(fellowQuery, [
      req.body.project_id,
    ]);
    return fellowResult; // Returning the fellow's email(s) inserted for the project.
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function getfellow(req) {
  try {
    // Constructing the query to fetch fellow details for the specified project_id.
    const query =
      "SELECT up.email_id FROM user_project up JOIN users u ON up.email_id = u.email_id WHERE project_id = $1 AND u.admin = 3";

    // Executing the query with the specified project_id from the request body.
    const db_res = await queryDatabase(query, [req.body.project_id]);

    console.log(db_res);

    return db_res; // Returning the result obtained from the database query.
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

async function deltfellow(req) {
  try {
    // Constructing the DELETE query
    var query =
      "DELETE FROM user_project WHERE project_id = $1 AND email_id = $2";
    await queryDatabase(query, [req.body.project_id, req.body.e_id]);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

module.exports = {
  addfellow,
  getfellow,
  deltfellow,
};
