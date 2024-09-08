var express = require('express');
var router = express.Router();

const pool = require("../database");
// const poola = require("../models/admin");
// const poolp = require("../models/professor");
// const pools = require("../models/student");
const poolu = require("../models/users");

async function addUser(req,res){
    try {
        // the data we get from request , just printing it 
        console.log(req.body);
        // running the insert command 
        const db_res = await pool.query(" INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING * ",[req.body.email_id,req.body.name,req.body.admin,req.body.department]);
        
        // creating a table for this prof:-
        if(req.body.admin==2 || req.body.admin==3){
            // first extracting the entry number
            var email = req.body.new_email_id;
            var index = email.indexOf("@")
            var str_query = "CREATE TABLE p_";
            str_query=str_query.concat(email.substring(0,index));
            str_query= str_query.concat("_proj_list");
            str_query=str_query.concat(" (project_id text, project_title text, professor_list text, project_grant integer, comment_time timestamp with time zone, pi text, co_pi text, dept text, fund_agency text, sanc_order_no text, sanctioned_date text, duration text, dos text, doc text, start_year text, is_appr integer default 0, is_running integer default 0)");
            console.log(str_query);
            const db_res2= await pool.query(str_query)
        }        

        
        // Based on the admin level, call the appropriate function to add user
        // if (req.body.admin == 1) {
        //     await poola.addAdmin(req.body); // Assuming poola exports a function 'addAdmin'
        // } else if (req.body.admin == 2) {
        //     await poolp.addProfessor(req.body); // Assuming poolp exports a function 'addProfessor'
        // } else if (req.body.admin == 3) {
        //     await pools.addStudent(req.body); // Assuming pools exports a function 'addStudent'
        // }
        var db_res3 = await pool.query("SELECT * from users");
        //returning all the row that were inserted
        res.json(db_res3.rows);
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {addUser:addUser}