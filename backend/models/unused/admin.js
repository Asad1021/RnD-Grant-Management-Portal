// admin.js
const { queryDatabase } = require('../../database');

async function addAdmin(adminData) {
    const sqlQuery = 'INSERT INTO admin (email_id, name) VALUES ($1, $2)';
    const params = [adminData.email_id, adminData.name];
    await queryDatabase(sqlQuery, params);
} 

async function deleteAdmin(email_id) {
    const sqlQuery = 'DELETE FROM admin WHERE email_id = $1';
    const params = [email_id];
    await queryDatabase(sqlQuery, params);
}

async function searchAdmin(email_id) {
    const sqlQuery = 'SELECT * FROM admin WHERE email_id = $1';
    const params = [email_id];
    const result = await queryDatabase(sqlQuery, params);

    // // Construct the complete query string with parameter values
    // const completeQuery = sqlQuery.replace(/\$[0-9]+/g, (match) => {
    //     const paramIndex = parseInt(match.slice(1)) - 1;
    //     return `'${params[paramIndex]}'`;
    // });
    console.log(result);
    return result;
}
// Similarly implement editAdmin and searchAdmins

module.exports = {
    addAdmin,
    deleteAdmin,
    // editAdmin,
    searchAdmin
};



// var express = require('express');
// var router = express.Router();

// const pool = require("./db");

// async function addUser(req,res){
//     try {
//         // the data we get from request , just printing it 
//         console.log(req.body);
//         // running the insert command 
//         const db_res = await pool.query(" INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING * ",[req.body.email_id,req.body.name,req.body.admin,req.body.department]);
        
//         // creating a table for this prof:-
//         if(req.body.admin==2 || req.body.admin==3){
//             // first extracting the entry number
//             var email = req.body.new_email_id;
//             var index = email.indexOf("@")
//             var str_query = "CREATE TABLE p_";
//             str_query=str_query.concat(email.substring(0,index));
//             str_query= str_query.concat("_proj_list");
//             str_query=str_query.concat(" (project_id text, project_title text, professor_list text, project_grant integer, comment_time timestamp with time zone, pi text, co_pi text, dept text, fund_agency text, sanc_order_no text, sanctioned_date text, duration text, dos text, doc text, start_year text, is_appr integer default 0, is_running integer default 0)");
//             console.log(str_query);
//             const db_res2= await pool.query(str_query)
//         }        

//         var db_res3 = await pool.query("SELECT * from users");
//         //returning all the row that were inserted
//         res.json(db_res3.rows);
//         if(req.body==1) {
//             async function addAdmin(adminData) {
//                 const sqlQuery = 'INSERT INTO admin (email_id, user_name) VALUES ($1, $2)';
//                 const params = [adminData.email_id, adminData.user_name];
//                 await queryDatabase(sqlQuery, params);
//             }
            
//             async function deleteAdmin(email_id) {
//                 const sqlQuery = 'DELETE FROM admin WHERE email_id = $1';
//                 const params = [email_id];
//                 await queryDatabase(sqlQuery, params);
//             }
//         }
//         else if(req.body == 2) {
//             async function addProfessor(professorData) {
//                 const sqlQuery = 'INSERT INTO student (email_id, user_name, entry_no, department) VALUES ($1, $2, $3, $4)';
//                 const params = [professorData.email_id, professorData.user_name, professorData.department];
//                 await queryDatabase(sqlQuery, params);
//             }
            
//             async function deleteProfessor(email_id) {
//                 const sqlQuery = 'DELETE FROM prof WHERE email_id = $1';
//                 const params = [email_id];
//                 await queryDatabase(sqlQuery, params);
//             }
            
//         }
//         else if(req.body == 3) {
//             async function addStudent(studentData) {
//                 const sqlQuery = 'INSERT INTO student (email_id, user_name, department) VALUES ($1, $2, $3)';
//                 const params = [studentData.email_id, studentData.user_name, studentData.department];
//                 await queryDatabase(sqlQuery, params);
//             }
            
//             async function deleteStudent(email_id) {
//                 const sqlQuery = 'DELETE FROM student WHERE email_id = $1';
//                 const params = [email_id];
//                 await queryDatabase(sqlQuery, params);
//             }
            
//         }
//     } catch (error) {
//         console.error(error.message);
//         throw error;
//     }
// }

// module.exports = {addUser:addUser}