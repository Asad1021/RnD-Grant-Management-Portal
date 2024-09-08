const { query } = require('express');
var express = require('express');
var router = express.Router();
const pool = require("../../components/db");

// to get a specific project 
async function delProject(req,res){

    try{

        // now corresponding to each professor we need to make an entry in his corresponding project table 
        var prof_emails = req.body.professors.split(',');

        for(var i in prof_emails)
        {
            // extracting the email before @
            var index = prof_emails[i].indexOf("@");

            var prof_id = prof_emails[i].substring(0,index);
            console.log(prof_id)

            // checking whether the prof exists as a user or not

            var query = "SELECT count(*) FROM users where email_id = '";
            query = query.concat(prof_emails[i])
            query = query.concat("' ")
            var db_temp_res = await pool.query(query)

            console.log( parseInt(db_temp_res.rows[0].count) )
            if( parseInt(db_temp_res.rows[0].count) == 0 )
            {
                continue;
            }

            query = "DELETE FROM p_"
            prof_id=prof_id.replace(".","dot");
            query=query.concat(prof_id)
            query=query.concat("_proj_list where project_id = '");
            query = query.concat(req.body.p_id)
            query = query.concat("'")
            var db_res2 = await pool.query(query);            

        }

            // First, fetch all the emails from the fellow table
            const query1 = `SELECT email FROM ${req.body.p_id}_fellow_table`;
            const db_res1 = await pool.query(query1);
            console.log(db_res1.rows)

            // Loop through each email and delete the corresponding entry from the prof email table
            for (const row of db_res1.rows) {
            let email = row.email;
            var index = email.indexOf("@");
            email = email.substring(0,index);
            email=email.replace(".","dot");
            const query2 = `DELETE FROM p_${email}_proj_list WHERE project_id = '${req.body.p_id}'`;
            const db_res2 = await pool.query(query2);
            }

        query = "DELETE FROM projects where project_id = '"
        query = query.concat(req.body.p_id)
        query = query.concat("'")

        var db_res = await pool.query(query);

        query = "DROP TABLE "
        query = query.concat(req.body.p_id)
        query = query.concat("_comment_table ");

        db_res = await pool.query(query);
        
        query = "DROP TABLE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table ");

        db_res = await pool.query(query);
        
        query = "DROP TABLE "
        query = query.concat(req.body.p_id)
        query = query.concat("_summary_comment_table ");

        db_res = await pool.query(query);

        query = "DROP TABLE "
        query = query.concat(req.body.p_id)
        query = query.concat("_fellow_table ");

        db_res = await pool.query(query);

        query = "DROP TABLE "
        query = query.concat(req.body.p_id)
        query = query.concat("_summary_table ");

        db_res = await pool.query(query);
        res.json(1);
    }catch(error){
        console.error(error.message);
    }

}

module.exports = {delProject:delProject}