// student.js
const { queryDatabase } = require("../database");

async function addProject(req) {
  console.log("projects");
  let result;

  if (req.body.link !== null) {
    result = await Func(req);
  } else {
    result = await func(req);
  }
  try {
    await queryDatabase(result.query, result.params);
  } catch (error) {
    console.error("Error adding project:", error.message);
    throw error; // Re-throw the error to propagate it to the calling function
  }
  console.log("projects ends");
  try {
    // const result = await queryDatabase(projectsQuery, projectsparams);
    console.log("user_proj");
    const user_projQuery =
      "INSERT INTO user_project (email_id, project_id) VALUES ($1, $2)";
    const user_projParams = [req.body.professors, req.body.project_id];
    console.log("iNSERTING: ", user_projParams);
    try {
      await queryDatabase(user_projQuery, user_projParams);
    } catch (error) {
      console.error("Error adding project:", error.message);
      throw error; // Re-throw the error to propagate it to the calling function
    }
    return result; // Optionally return the result if needed
  } catch (error) {
    console.error("Error adding project:", error.message);
    throw error; // Re-throw the error to propagate it to the calling function
  }
}

async function appr_Project(req) {
  try {
    if (!req.body.p_id) {
      // Handle the case where project_id is missing in the request body
      throw new Error("Project ID is missing in the request body.");
    }

    // Update project approval status
    const query = `
      UPDATE projects
      SET is_appr = 0
      WHERE project_id = $1
    `;
    const params = [req.body.p_id];
    await queryDatabase(query, params);

    // Send success response
    console.log("Project approved successfully");
    // return { success: true, message: "Project approved successfully." };
  } catch (error) {
    throw error;
  }
}

async function deleteProject(req) {
  try {
    if (!req.body.p_id) {
      // Handle the case where project_id is missing in the request body
      throw new Error("Project ID is missing in the request body.");
    }
    const project_id = req.body.p_id;

    // Begin a transaction to ensure atomicity
    await queryDatabase("BEGIN");

    // Delete records from tables referencing projects table
    const deleteQueries = [
      `DELETE FROM user_project WHERE project_id = $1`,
      `DELETE FROM Main_table WHERE project_id = $1`,
      `DELETE FROM comment_table WHERE project_id = $1`,
      `DELETE FROM summary_table WHERE project_id = $1`,
      `DELETE FROM summary_comment_table WHERE project_id = $1`,
      `DELETE FROM projects WHERE project_id = $1`,
    ];

    for (const query of deleteQueries) {
      await queryDatabase(query, [project_id]);
    }

    await queryDatabase("COMMIT");

    console.log("Project deleted successfully");
    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    // Rollback the transaction in case of an error
    await queryDatabase("ROLLBACK");

    console.error(error.message);
    throw error;
  }
}

async function Func(req) {
  const projectsQuery =
    "INSERT INTO projects VALUES ($1,$2,$3,current_timestamp,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *";

  const projectsparams = [
    req.body.project_id,
    req.body.project_title,
    req.body.grant,
    req.body.pi,
    req.body.co_pi,
    req.body.dept,
    req.body.fund_agency,
    req.body.sanc_order_no,
    req.body.sanctioned_date,
    req.body.duration,
    req.body.dos,
    req.body.doc,
    req.body.start_year,
    req.body.flag === 1 ? 0 : 1, // Assuming this is a default value for the 15th parameter
    0,
    req.body.link,
  ];

  return { query: projectsQuery, params: projectsparams };
}

async function func(req) {
  const projectsQuery =
    "INSERT INTO projects VALUES ($1,$2,$3,current_timestamp,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *";

  const projectsparams = [
    req.body.project_id,
    req.body.project_title,
    req.body.grant,
    req.body.pi,
    req.body.co_pi,
    req.body.dept,
    req.body.fund_agency,
    req.body.sanc_order_no,
    req.body.sanctioned_date,
    req.body.duration,
    req.body.dos,
    req.body.doc,
    req.body.start_year,
    req.body.flag === 1 ? 0 : 1,
  ];

  return { query: projectsQuery, params: projectsparams };
}

async function computeCommFlag() {
  try {
    // Get all project IDs from the projects table
    const query = "SELECT project_id FROM projects";
    const result = await queryDatabase(query, []);

    // Loop through all project IDs and compute the comm_flag
    for (const row of result) {
      const projectId = row.project_id;

      // Get the sum of comm_flag from summary_table for the current project
      const summaryQuery = `SELECT SUM(comm_flag) AS sum FROM summary_table WHERE project_id = $1`;
      const summaryResult = await queryDatabase(summaryQuery, [projectId]);
      const summarySum = summaryResult[0].sum || 0;

      // Get the sum of comm_flag from main_table for the current project
      const mainQuery = `SELECT SUM(comm_flag) AS sum FROM main_table WHERE project_id = $1`;
      const mainResult = await queryDatabase(mainQuery, [projectId]);
      const mainSum = mainResult[0].sum || 0;

      // Compute comm_flag for the project based on the sum of comm_flag from summary_table and main_table
      const commFlag = summarySum > 0 || mainSum > 0 ? 1 : 0;

      // Update the projects table with the computed comm_flag
      const updateQuery = `UPDATE projects SET comm_flag = $1 WHERE project_id = $2`;
      await queryDatabase(updateQuery, [commFlag, projectId]);
    }
  } catch (error) {
    console.error("Error computing comm_flag:", error.message);
    throw error;
  }
}

async function fetchProjects(req, res) {
  try {
    // Running the select command
    var projects;
    if (req.body.sort == 1) {
      // Sorting by the comment time
      await computeCommFlag();
      const db_res = await queryDatabase(
        "SELECT * FROM projects ORDER BY comment_time DESC",
        []
      );
      // Modify comment_time format
      projects = db_res.map((project) => ({
        ...project,
        comment_time: new Date(project.comment_time).toLocaleString("en-US", {
          timeZone: "UTC", // Set timezone if needed
        }),
      }));
    } else {
      // Sorting by grant money
      projects = await queryDatabase(
        "SELECT * FROM projects ORDER BY grant",
        []
      );
    }
    for (let i = 0; i < projects.length; i++) {
      const query =
        "SELECT email_id FROM user_project WHERE project_id = $1 AND email_id IN (SELECT email_id FROM users WHERE admin = 2)";

      // Assuming queryDatabase returns a Promise resolving to an array with at least one object
      const result = await queryDatabase(query, [projects[i].project_id]);

      // Check if the result is not empty
      if (result && result.length > 0) {
        projects[i].email_id = result[0].email_id;
      } else {
        console.log(
          `No email_id found for project with ID ${projects[i].project_id}`
        );
      }
    }

    let data = new Array(projects.length);

    for (let i = 0; i < projects.length; i++) {
      data[i] = {
        project_id: projects[i].project_id,
        email_id: projects[i].email_id,
        project_title: projects[i].project_title,
        project_grant: projects[i].project_grant,
        comment_time: projects[i].comment_time,
        pi: projects[i].pi,
        co_pi: projects[i].co_pi,
        dept: projects[i].dept,
        fund_agency: projects[i].fund_agency,
        sanc_order_no: projects[i].sanc_order_no,
        sanctioned_date: projects[i].sanctioned_date,
        duration: projects[i].duration,
        dos: projects[i].dos,
        doc: projects[i].doc,
        start_year: projects[i].start_year,
        is_appr: projects[i].is_appr,
        is_running: projects[i].is_running,
        drive_link: projects[i].drive_link,
        comm_flag: projects[i].comm_flag,
      };
    }
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    throw error;
  }
}

async function searchProject(req, res) {
  try {
    let query = "",param=[], params;
    const type = req.body.type;
    const searchTerm = req.body.title;
    const admin = req.body.admin;
    const id = req.body.id;
    const pi = req.body.pi;
    const dept = req.body.dept;
    const year = req.body.year;
    const fundAgency = req.body.fund_agency;
    let result;
    if (admin == 1) {
      if (type == 1) {
        query =
          "SELECT * FROM projects WHERE lower(project_title) LIKE lower($1)";
          param = [searchTerm];
      } else if (type == 2) {
        query = "SELECT * FROM projects WHERE project_id = $1";
        param = [id];
      } else if (type == 3) {
        query = "SELECT * FROM projects WHERE lower(pi) LIKE lower($1)";
        param = [pi];
      } else if (type == 4) {
        query = "SELECT * FROM projects WHERE lower(dept) LIKE lower($1)";
        param = [dept];
      } else if (type == 5) {
        query = "SELECT * FROM projects WHERE start_year = $1";
        param = [year];
      } else if (type == 6) {
        query =
          "SELECT * FROM projects WHERE lower(fund_agency) LIKE lower($1)";
          param = [fundAgency];
      }
      result = await queryDatabase(query, param);
    } else {
      const prof_id = req.body.email_id;
      if (type == 1) {
        query =
          "SELECT * FROM projects WHERE lower(project_title) LIKE lower($1) AND project_id in (SELECT project_id FROM user_project WHERE email_id = $2); ";
          params = searchTerm
      } else if (type == 2) {
        query =
          "SELECT * FROM projects WHERE project_id = $1 AND project_id in (SELECT project_id FROM user_project WHERE email_id = $2);";
          params = id;
      } else if (type == 3) {
        query =
          "SELECT * FROM projects WHERE lower(pi) LIKE lower($1) AND project_id in (SELECT project_id FROM user_project WHERE email_id = $2);";
          params = pi;
      } else if (type == 4) {
        query =
          "SELECT * FROM projects WHERE lower(dept) LIKE lower($1) AND project_id in (SELECT project_id FROM user_project WHERE email_id = $2);";
          params = dept; 
      } else if (type == 5) {
        query =
          "SELECT * FROM projects WHERE start_year = $1 AND project_id in (SELECT project_id FROM user_project WHERE email_id = $2);";
          params = year;
      } else if (type == 6) {
        query =
          "SELECT * FROM projects WHERE lower(fund_agency) LIKE lower($1) AND project_id in (SELECT project_id FROM user_project WHERE email_id = $2);";
          params = fundAgency;
      }
      console.log(pi);
      
      result = await queryDatabase(query, [params,prof_id]);
    }
    const projects = result;
    for (let i = 0; i < projects.length; i++) {
      const query =
        "SELECT email_id FROM user_project WHERE project_id = $1 AND email_id IN (SELECT email_id FROM users WHERE admin = 2)";

      // Assuming queryDatabase returns a Promise resolving to an array with at least one object
      const result = await queryDatabase(query, [projects[i].project_id]);

      // Check if the result is not empty
      if (result && result.length > 0) {
        projects[i].email_id = result[0].email_id;
      } else {
        console.log(
          `No email_id found for project with ID ${projects[i].project_id}`
        );
      }
    }

    let data = new Array(projects.length);

    for (let i = 0; i < projects.length; i++) {
      data[i] = {
        project_id: projects[i].project_id,
        email_id: projects[i].email_id,
        project_title: projects[i].project_title,
        project_grant: projects[i].project_grant,
        comment_time: projects[i].comment_time,
        pi: projects[i].pi,
        co_pi: projects[i].co_pi,
        dept: projects[i].dept,
        fund_agency: projects[i].fund_agency,
        sanc_order_no: projects[i].sanc_order_no,
        sanctioned_date: projects[i].sanctioned_date,
        duration: projects[i].duration,
        dos: projects[i].dos,
        doc: projects[i].doc,
        start_year: projects[i].start_year,
        is_appr: projects[i].is_appr,
        is_running: projects[i].is_running,
        drive_link: projects[i].drive_link,
        comm_flag: projects[i].comm_flag,
      };
    }
    return data;
  } catch (error) {
    console.error("Error searching project:", error.message);
    throw error;
  }
}

async function displayProject(req, res) {
  try {
    // Query to fetch projects associated with the user
    var query = `
      SELECT projects.*, user_project.email_id 
      FROM projects 
      JOIN user_project ON projects.project_id = user_project.project_id
      WHERE user_project.email_id = $1
      ORDER BY projects.comment_time DESC`;

    // Fetch projects from the database
    var db_res = await queryDatabase(query, [req.params.email_id]);

    // Format the timestamp and extract professor names
    for (let step = 0; step < db_res.length; step++) {
      db_res[step].comment_time =
        db_res[step].comment_time.toLocaleDateString("en-US") +
        " " +
        db_res[step].comment_time.toLocaleTimeString("en-US");

      // Check if professor_list exists before splitting
      if (db_res[step].professor_list) {
        var prof_emails = db_res[step].professor_list.split(",");
        var professorNames = "";

        for (var i in prof_emails) {
          var professorData = await queryDatabase(
            "SELECT * FROM users WHERE email_id = $1",
            [prof_emails[i]]
          );
          professorNames += " " + professorData[0].user_name;
        }

        db_res[step].names = professorNames;
      }
    }

    // Send the formatted project data back to the client
    return db_res;
  } catch (error) {
    console.error("Error displaying projects:", error.message);
    throw error;
  }
}

async function projectcolor(req) {
  try {
    // Define your queries here
    const sumCommFlagQuery = `
      SELECT SUM(comm_flag) AS sum
      FROM summary_table
      WHERE project_id = $1
    `;

    const updateCommFlagQuery = `
      UPDATE projects 
      SET comm_flag = 1 
      WHERE project_id = $1
    `;
    const projectsParams = [req.body.p_id];

    // Execute queries
    const summaryResult = await queryDatabase(sumCommFlagQuery, projectsParams);
    return { summaryResult /*, mainResult */ };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateCommflag(req) {
  try {
    await queryDatabase(
      "UPDATE projects SET comm_flag = 1 WHERE project_id = $1",
      [req.body.project_id]
    );
  } catch (error) {
    console.error("Error updating comm_flag:", error.message);
    throw error;
  }
}
async function getALlProjectId(){
  const query = "SELECT project_id FROM projects";
  let IDs;
  try {
    IDs = await queryDatabase(query, []);
  } catch (error) {
    console.error("Error getting project IDs:", error.message);
    throw error;
  }
  
  return IDs;
}
// Similarly implement editStudent and searchStudents

module.exports = {
  addProject,
  appr_Project,
  // fetchProject,
  deleteProject,
  searchProject,
  displayProject,
  fetchProjects,
  projectcolor,
  updateCommflag,
  getALlProjectId,
  // editStudent,
};
