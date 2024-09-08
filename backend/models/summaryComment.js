const { queryDatabase } = require("../database");

async function addsComment(req) {
  try {
    // Inserting a comment into summary_comment_table
    var query = `INSERT INTO summary_comment_table (sr, comment, person, comment_time, resolved, project_id) 
                  VALUES ($1, $2, $3, current_timestamp, 'NO', $4)`;
    await queryDatabase(query, [
      req.body.row_no,
      req.body.comment_body,
      req.body.prof_name,
      req.body.project_id,
    ]);
    console.log(query);
    // Updating the comm_flag in summary_table if the user is an admin
    console.log("reques Is: ")
    console.log(req.body);
    if (req.body.is_admin === 2 || req.body.is_admin === 3) {
      query = `UPDATE summary_table 
               SET comm_flag = 1 
               WHERE sr = $1 AND project_id = $2`;
      await queryDatabase(query, [req.body.row_no, req.body.project_id]);
      console.log("worked" + [req.body.row_no, req.body.project_id]);
    }

    // Updating comment_time in projects table
    await queryDatabase(
      "UPDATE projects SET comment_time = current_timestamp WHERE project_id = $1",
      [req.body.project_id]
    );

    // TODO: Implement updating comment times in other related tables
    // var db_res4 = await queryDatabase(
    //   "SELECT professor_list from projects where project_id = $1",
    //   [req.body.project_id]
    // );
    // ...

  } catch (error) {
    console.error("Error in addsummaryComment function:", error);
    throw error;
  }
}


async function getsComment(req) {
  try {
    // Selecting comments for a particular project and sr
    var query = "SELECT * FROM summary_comment_table WHERE sr = $1 AND project_id = $2 ORDER BY comment_time DESC";
    const temp_json = await queryDatabase(query, [req.body.row_no, req.body.project_id]);
    return temp_json;
  } catch (error) {
    console.error("Error in getsComment function:", error);
    throw error;
  }
}

module.exports = {
  addsComment,
  getsComment
}