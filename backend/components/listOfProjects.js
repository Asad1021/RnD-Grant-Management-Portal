var express = require('express');
var router = express.Router();
const pool = require("./db");

async function computeCommFlag() {
    try {
        // Get all project IDs from the projects table
        const query = 'SELECT project_id FROM projects';
        const result = await pool.query(query);

        // Loop through all project IDs and compute the comm_flag
        for (const row of result.rows) {
            const projectId = row.project_id;
            const summaryQuery = `SELECT sum(comm_flag) as sum from ${projectId}_summary_table`;
            const summaryResult = await pool.query(summaryQuery);

            const mainQuery = `SELECT sum(comm_flag) as sum from ${projectId}_main_table`;
            const mainResult = await pool.query(mainQuery);
            console.log(summaryResult.rows[0].sum);
            console.log(mainResult.rows[0].sum > 0);
            if (summaryResult.rows[0].sum > 0 || mainResult.rows[0].sum > 0) {
                await pool.query('UPDATE projects SET comm_flag = 1 WHERE project_id = $1', [projectId]);
            }
            else{
                await pool.query('UPDATE projects SET comm_flag = 0 WHERE project_id = $1', [projectId]);
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function listOfProjects(req,res){

    try{
        //running the select command
        if(req.body.sort==1)
        {
            // sorting by the comment time
            await computeCommFlag();
            var db_res = await pool.query("SELECT * from projects ORDER BY comment_time DESC");
            
            console.log("REQUEST RECEIVED");
            
            //console.log(db_res.rows[0].comment_time.toLocaleTimeString("en-US"));
            
            var temp_json = db_res.rows;
            
            console.log(temp_json.length);

            for (let step = 0; step < temp_json.length; step++) {
                
                temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
                
                
                // var prof_emails = temp_json[step].professor_list.split(',');
                // var to_ret = ""
                // for (var i in prof_emails) {
                //     // extracting the user names 
                //     db_res = await pool.query("SELECT * FROM users where email_id = $1", [prof_emails[i]]);
                    
                //     to_ret=to_ret.concat(" ");
                //     to_ret=to_ret.concat(db_res.rows[0].user_name);
                // }
                // temp_json[step].names = to_ret;
            }

            console.log(temp_json);
            //returning all the rows
            res.json(temp_json);


        }
        else
        {
            //sorting by grant money
            const db_res = await pool.query("SELECT * from projects ORDER BY grant");

            //returning all the rows
            res.json(db_res.rows);
        }
        

    }catch(error){
        console.error(error.message);
    }

}
// to get the list of all projects 
// router.post("/project",listOfProj);


// module.exports = router;
module.exports = {listOfProjects:listOfProjects}