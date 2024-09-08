const { queryDatabase } = require("../database");

async function addcomment(req) {
  try {
    await comment(req);
    const commentQuery = `
            INSERT INTO comment_table 
            (project_id, sr, comment, person, comment_time, resolved) 
            VALUES 
            ($1, $2, $3, $4, current_timestamp, 'NO')
        `;
    const commentValues = [
      req.body.project_id,
      req.body.row_no,
      req.body.comment_body,
      req.body.prof_email,
    ];
    await queryDatabase(commentQuery, commentValues);
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

async function maintableupdate(req) {
  try {
    const mainTableUpdateQuery = `
                UPDATE Main_table 
                SET comm_flag = 1 
                WHERE project_id = $1 AND sr = $2
            `;
    const mainTableUpdateValues = [req.body.project_id, req.body.row_no];
    await queryDatabase(mainTableUpdateQuery, mainTableUpdateValues);
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

async function projectTableUpdate(req) {
  try {
    const projectTableUpdateQuery = `
            UPDATE projects 
            SET comment_time = current_timestamp 
            WHERE project_id = $1
        `;
    await queryDatabase(projectTableUpdateQuery, [req.body.project_id]);
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

async function getcomment(req) {
  try {
    // adding a comment for a particular project.
    var query = "SELECT * FROM comment_table where sr=$1 AND project_id = $2 order by comment_time desc";
    const db_res = await queryDatabase(query, [req.body.row_no, req.body.project_id]);

    // now updating the row of main table where the comment has been made ,setting the comm_flag to 0
    if (req.body.is_admin == 1) {
      var query = `UPDATE Main_table 
      SET comm_flag = 0 
      WHERE sr = $1 AND project_id = $2`;

      console.log(query);
      // Assuming req.body.row_no contains the value you want to use for the 'sr' condition
      var row_no = req.body.row_no;
      var project_id = req.body.project_id;
      await queryDatabase(query, [row_no, project_id]);
    }
    return db_res;
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

module.exports = {
  addcomment,
  maintableupdate,
  projectTableUpdate,
  getcomment,
};
