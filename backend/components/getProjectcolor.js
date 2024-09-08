var express = require('express');
var router = express.Router();
const pool = require("./db");

// async function getProjectcolor(req, res){
//     try{
//         var query="Select sum(comm_flag) as sum from ";
//         query=query.concat(req.body.project_id)
//         query=query.concat("_summary_table")
//         var temp_db = await pool.query(query);

//         var query1 = "Select sum(comm_flag) as sum from ";
//         query1 = query1.concat(req.body.project_id)
//         query1 = query1.concat("_main_table ")
//         var temp_db1 = await pool.query(query1);
//         console.log(temp_db.rows[0].sum);
//         console.log(temp_db1.rows[0].sum);

//         if(temp_db.rows[0].sum >0 ||  temp_db1.rows[0].sum > 0){
            

//             var temp_db1 = await pool.query("Update projects set comm_flag=1 where project_id=$1", [req.body.project_id]);
//             res.json(1) 
//         }
//         else{
//             res.json(0) 

//         }
//     }
//     catch(error){
//         console.log(error);
//     }
// }

async function getProjectcolor(req, res) {
    try {
        // Constructing queries to calculate the sum of comm_flag from the summary table and main table.
        const summaryQuery = `
            SELECT SUM(comm_flag) AS sum
            FROM summary_table
            WHERE project_id = $1
        `;
        const mainQuery = `
            SELECT SUM(comm_flag) AS sum
            FROM Main_table
            WHERE project_id = $1
        `;

        // Executing the queries.
        const summaryResult = await pool.query(summaryQuery, [req.body.project_id]);
        const mainResult = await pool.query(mainQuery, [req.body.project_id]);

        // Extracting the sums from the query results.
        const summarySum = summaryResult.rows[0].sum || 0;
        const mainSum = mainResult.rows[0].sum || 0;

        // Checking if either sum is greater than 0.
        if (summarySum > 0 || mainSum > 0) {
            // Updating the projects table comm_flag to 1.
            await pool.query("UPDATE projects SET comm_flag = 1 WHERE project_id = $1", [req.body.project_id]);
            // Sending response indicating project color change.
            res.json(1);
        } else {
            // Sending response indicating no change in project color.
            res.json(0);
        }
    } catch (error) {
        console.error(error);
        // Sending error response in case of any error.
        res.status(500).json({ error: error.message });
    }
}


module.exports = { getProjectcolor: getProjectcolor };