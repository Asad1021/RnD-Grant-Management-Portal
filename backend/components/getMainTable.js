var express = require('express');
var router = express.Router();
const pool = require("./db");


// to get the details of main table of a project 
// async function getMainTable(req,res){

//     try{

//         //getting the details from the project (main) table 
//         var query = "SELECT * from "
//         query = query.concat(req.body.project_id)
//         query=query.concat("_main_table order by sr asc");
//         const db_res = await pool.query(query);

//         //returning all the rows received from the table

//         temp_res = db_res.rows;

//         res.json(db_res.rows);

        
//     }catch(error){
//         console.error(error.message);
//     }

// }

async function getMainTable(req, res) {
    try {
        // Constructing the query to fetch details from the main table for the specified project_id.
        const query = `
            SELECT *
            FROM Main_table
            WHERE project_id = $1
            ORDER BY sr ASC
        `;

        // Executing the query with the specified project_id from the request body.
        const db_res = await pool.query(query, [req.body.project_id]);

        // Sending the fetched rows from the main table as a response.
        res.json(db_res.rows).status(200);
    } catch (error) {
        console.error(error.message);
        // Sending error response in case of any error.
        res.status(500).json({ error: error.message });
    }
}


module.exports = {getMainTable:getMainTable};
