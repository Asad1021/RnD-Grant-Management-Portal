var express = require('express');
var router = express.Router();
const pool = require("./db");

async function getMarkRead(req, res) {

    try {
        if (req.body.is_admin == 1) {
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query = query.concat("_summary_table set comm_flag = 0  where sr = ")
            query = query.concat(req.body.row_no);
            var temp_db = await pool.query(query);
            console.log("executed");


            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query = query.concat("_summary_comment_table set resolved='Yes'  where sr = ")
            query = query.concat(req.body.row_no);
            var temp_db = await pool.query(query);
            console.log("executed 2");
           

        }

        
        res.json(1);

      

    } catch (error) {
        console.error(error.message);
    }
}
module.exports = { getMarkRead: getMarkRead }