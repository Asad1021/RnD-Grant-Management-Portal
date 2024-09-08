var express = require('express');
var router = express.Router();
const pool = require("../../components/db");
async function specificProject(req, res) {
  try {
    let query = "";
    const admin = req.body.admin;
    const type = req.body.type;
    const searchTerm = req.body.title;
    const id = req.body.id;
    const pi = req.body.pi;
    const dept = req.body.dept;
    const year = req.body.year;
    const fundAgency = req.body.fund_agency;

    if (admin == 1) {
      if (type == 1) {
        query = `SELECT * FROM projects WHERE lower(project_title) LIKE lower('%${searchTerm}%')`;
      } else if (type == 2) {
        query = `SELECT * FROM projects WHERE project_id = '${id}'`;
      } else if (type == 3) {
        query = `SELECT * FROM projects WHERE lower(pi) LIKE lower('%${pi}%')`;
      } else if (type == 4) {
        query = `SELECT * FROM projects WHERE lower(dept) LIKE lower('%${dept}%')`;
      } else if (type == 5) {
        query = `SELECT * FROM projects WHERE start_year = '${year}'`;
      } else if (type == 6) {
        query = `SELECT * FROM projects WHERE lower(fund_agency) LIKE lower('%${fundAgency}%')`;
      }
    } else if (admin == 2) {
      const index = req.body.email_id.indexOf("@");
      const prof_id = req.body.email_id.substring(0, index).replace(".", "dot");

      if (type == 1) {
        query = `SELECT * FROM p_${prof_id}_proj_list WHERE lower(project_title) LIKE lower('%${searchTerm}%')`;
      } else if (type == 2) {
        query = `SELECT * FROM p_${prof_id}_proj_list WHERE project_id = '${id}'`;
      } else if (type == 3) {
        query = `SELECT * FROM p_${prof_id}_proj_list WHERE lower(pi) LIKE lower('%${pi}%')`;
      } else if (type == 4) {
        query = `SELECT * FROM p_${prof_id}_proj_list WHERE lower(dept) LIKE lower('%${dept}%')`;
      } else if (type == 5) {
        query = `SELECT * FROM p_${prof_id}_proj_list WHERE start_year = '${year}'`;
      } else if (type == 6) {
        query = `SELECT * FROM p_${prof_id}_proj_list WHERE lower(fund_agency) LIKE lower('%${fundAgency}%')`;
      }
    }

    console.log(query);
    const db_res = await pool.query(query);
    const temp_json = db_res.rows;

    console.log(temp_json.length);

    for (let step = 0; step < temp_json.length; step++) {
      temp_json[step].comment_time = temp_json[step].comment_time.toLocaleDateString("en-US") + " " + temp_json[step].comment_time.toLocaleTimeString("en-US");
    }

    console.log(temp_json);

    res.json(temp_json);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { specificProject: specificProject };
