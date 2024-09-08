var express = require('express');
var router = express.Router();
const pool = require("../components/db");

// async function addComment(req,res){

//     try{
        
//         // adding a comment for a particular project.
        
        // var query = "INSERT INTO "
        // query = query.concat(req.body.project_id);
        // query=query.concat("_comment_table VALUES ($1,$2,$3,current_timestamp,'NO')");
        // const db_res = await pool.query(query,[req.body.row_no,req.body.comment_body,req.body.prof_email]);

        // // now updating the row of main table where the comment has been made ,setting the comm_flag to 1 
        // if(req.body.is_admin == 2 || req.body.is_admin == 3)
        // {
        //     query = "UPDATE ";
        //     query = query.concat(req.body.project_id)
        //     query = query.concat("_main_table set comm_flag = 1 where sr = ")
        //     query = query.concat(req.body.row_no);
        //     var temp_db = await pool.query(query);
        // }
        


        // const db_res2 = await pool.query("UPDATE projects set comment_time = current_timestamp where project_id = $1",[req.body.project_id]);

        // var db_res4 = await pool.query("SELECT professor_list from projects where project_id = $1",[req.body.project_id]);

        // var professors = db_res4.rows[0].professor_list;
        // var prof_emails =professors.split(',');

        // for(var i in prof_emails)
        // {
        //     // extracting the email before @
        //     var index = prof_emails[i].indexOf("@");


        //     var prof_id = prof_emails[i].substring(0,index);
        //     prof_id=prof_id.replace(".","dot");
        //     console.log(prof_id)
        //     var query = "UPDATE p_"
        //     query=query.concat(prof_id)
        //     query=query.concat("_proj_list SET comment_time = current_timestamp where project_id = $1");
        //     var db_res6 = await pool.query(query,[req.body.project_id]);            

        // }

        //returning 1 to status 
//         res.json(1);
        
//     }catch(error){
//         console.error(error.message);
//     }

// // addding a comment
// }

/*new schema for comment table:
comment_table(
    project_id text References projects(project_id),
    sr text,
    comment text,
    person text,
    comment_time TIMESTAMP with time zone,
    resolved text
);
*/

async function addComment(req, res) {
    try {
        // Adding a comment for a particular project.

        // Constructing the query to insert the comment into the comment_table for the specified project_id.
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
            req.body.prof_email
        ];
        await pool.query(commentQuery, commentValues);

        // Updating the row of the Main_table where the comment has been made, setting the comm_flag to 1.
        if (req.body.is_admin === 2 || req.body.is_admin === 3) {
            const mainTableUpdateQuery = `
                UPDATE Main_table 
                SET comm_flag = 1 
                WHERE project_id = $1 AND sr = $2
            `;
            const mainTableUpdateValues = [
                req.body.project_id,
                req.body.row_no
            ];
            await pool.query(mainTableUpdateQuery, mainTableUpdateValues);
        }

        // Updating the projects table to set comment_time to current_timestamp.
        await pool.query("UPDATE projects SET comment_time = current_timestamp WHERE project_id = $1", [req.body.project_id]);

        //// Fetching the professor_list from the projects table.
        // const professorListQuery = `
        //     SELECT professor_list 
        //     FROM projects 
        //     WHERE project_id = $1
        // `;
        // const professorListResult = await pool.query(professorListQuery, [req.body.project_id]);
        // const professors = professorListResult.rows[0].professor_list;

        // // Splitting the professor_list to get individual professor emails.
        // const profEmails = professors.split(',');

        // // Looping through each professor email to update their respective project lists with the comment_time.
        // for (const email of profEmails) {
        //     // Extracting the email before @ and replacing '.' with 'dot' to form the professor_id.
        //     const index = email.indexOf("@");
        //     const profId = email.substring(0, index).replace(".", "dot");

        //     // Constructing the query to update the professor's project list table.
        //     const profProjListUpdateQuery = `
        //         UPDATE ${profId}_proj_list 
        //         SET comment_time = current_timestamp 
        //         WHERE project_id = $1
        //     `;
        //     await pool.query(profProjListUpdateQuery, [req.body.project_id]);
        // }

        // Returning success status.
        res.json(1).status(200);
    } catch (error) {
        console.error(error.message);
        // Returning error status.
        res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = {addComment:addComment}