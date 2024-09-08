var express = require('express');
var router = express.Router();
const pool = require("../../components/db");

async function specificuser(req, res) {
  try {
    if (req.body.type == 1) {
      var db_res = await pool.query("SELECT * FROM users WHERE lower(email_id) LIKE lower($1)", [`%${req.body.email}%`]);
    } else if (req.body.type == 2) {
      var db_res = await pool.query("SELECT * FROM users WHERE lower(department) LIKE lower($1)", [`%${req.body.department}%`]);
    }

    res.json(db_res.rows);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { specificuser: specificuser };
