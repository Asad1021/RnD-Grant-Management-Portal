var express = require('express');
var router = express.Router();

const pool = require("./db");

// async function getFellow(req,res){
//     try {
//         // the data we get from request , just printing it 
//         console.log(req.body);
        
//         var query = "SELECT * FROM "
//         query = query.concat(req.body.project_id);
//         query=query.concat("_fellow_table");
//         const db_res3 = await pool.query(query); 
//         res.json(db_res3.rows);
    
//     } catch (error) {
//         console.error(error.message);
//     }
// }
async function getFellow(req, res) {
    try {
        // Constructing the query to fetch fellow details for the specified project_id.
        const query = `
            SELECT * 
            FROM fellow_table 
            WHERE project_id = $1
        `;
        
        // Executing the query with the specified project_id from the request body.
        const db_res = await pool.query(query, [req.body.project_id]);

        // Sending the fetched fellow details as a response.
        res.json(db_res.rows).status(200);
    
    } catch (error) {
        console.error(error.message);
        // Sending error response in case of any error.
        res.status(500).json({ error: error.message });
    }
}
module.exports = {getFellow:getFellow};


