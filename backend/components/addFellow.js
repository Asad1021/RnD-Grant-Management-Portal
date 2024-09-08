var express = require('express');
var router = express.Router();

const pool = require("./db");

// to add a user 
// async function addFellow(req,res){
//     try {
//         // the data we get from request , just printing it 
//         console.log(req.body);

//         // running the insert command
//         var query = "INSERT INTO "
//         query = query.concat(req.body.project_id);
//         query=query.concat("_fellow_table VALUES ($1)");
//         const db_res = await pool.query(query,[req.body.email_id]);
//         console.log(1);
//         var query = "SELECT * FROM projects where project_id = '"
//         query = query.concat(req.body.project_id);
//         query=query.concat("'");
//         const db_res2 = await pool.query(query); 
//         console.log(db_res2.rows)

//         const row = db_res2.rows[0];
//         var index = req.body.email_id.indexOf("@");
//         var prof_id = req.body.email_id.substring(0,index);
//         prof_id=prof_id.replace(".","dot");
//         console.log(prof_id)

//         var query = "INSERT INTO p_"
//         query=query.concat(prof_id)
//         query=query.concat("_proj_list VALUES ($1,$2,$3,$4,current_timestamp,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)");
//         const db_res4 = await pool.query(query,[row.project_id,row.project_title,row.professor_list,row.project_grant,row.pi,row.co_pi,row.dept,row.fund_agency,row.sanc_order_no,row.sanctioned_date,row.duration,row.dos,row.doc,row.start_year]);            

//         var query = "SELECT * FROM "
//         query = query.concat(req.body.project_id);
//         query=query.concat("_fellow_table");
//         const db_res3 = await pool.query(query); 
//         // var db_res3 = await pool.query("SELECT * from users");
//         //returning all the row that were inserted
//         res.json(db_res3.rows);
    
//     } catch (error) {
//         console.error(error.message);
//     }
// }

async function addFellow(req, res) {
    try {
        // Inserting the fellow's email into the fellow_table for the specified project_id.
        const insertFellowQuery = `
            INSERT INTO fellow_table 
            (project_id, email_id) 
            VALUES ($1, $2)
        `;
        await pool.query(insertFellowQuery, [req.body.project_id, req.body.email_id]);
        

        // Inserting project details into the prof_project table.
        const insertProfProjectQuery = `
            INSERT INTO prof_project 
            (prof_id, project_id) 
            VALUES ($1, $2)
        `;
        await pool.query(insertProfProjectQuery, [req.body.email_id, req.body.project_id]);

        

        // Fetching all fellow emails inserted for the specified project_id.
        const fellowQuery = `
            SELECT email_id 
            FROM fellow_table
            WHERE project_id = $1
        `;
        const fellowResult = await pool.query(fellowQuery, [req.body.project_id]);

        // Returning the list of fellow emails inserted.
        res.json(fellowResult.rows).status(200);
    } catch (error) {
        console.error(error.message);
        // Returning error status.
        res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = {addFellow:addFellow}