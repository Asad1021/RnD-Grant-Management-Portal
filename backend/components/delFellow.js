const { query } = require('express');
var express = require('express');
var router = express.Router();
const pool = require("./db");


async function delFellow(req,res){

    try{

        var query = "DELETE FROM "
        query = query.concat(req.body.project_id);
        query=query.concat("_fellow_table where email = '");
        query = query.concat(req.body.e_id)
        // console.log(req.body.e_id)
        query = query.concat("'")

        var db_res = await pool.query(query);

        var index = req.body.e_id.indexOf("@");

            var prof_id = req.body.e_id.substring(0,index);
            console.log(prof_id)
            query = "DELETE FROM p_"
            prof_id=prof_id.replace(".","dot");
            query=query.concat(prof_id)
            query=query.concat("_proj_list where project_id = '");
            query = query.concat(req.body.project_id)
            query = query.concat("'")
            var db_res2 = await pool.query(query); 
        
        // if(req.body.admin==2 || req.body.admin==3){
        // var index = req.body.new_e_id.indexOf("@");

        // var prof_id = req.body.new_e_id.substring(0,index);
        // console.log(prof_id)

        // query = "DROP TABLE if exists p_"
        // query = query.concat(prof_id)
        // query = query.concat("_proj_list ");

        // db_res = await pool.query(query);
        // }
        res.json(1);


    }catch(error){
        console.error(error.message);
    }

};

module.exports = {delFellow:delFellow}