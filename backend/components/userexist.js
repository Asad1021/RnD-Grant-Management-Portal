var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const pool = require("../../components/db");

async function userexist(req, res){
 
    const { email } = req.body; // Extract email from request body
    
    const result = await pool.query("SELECT * FROM users WHERE email_id='" +  email + "'");
      if (result.rowCount > 0) {
        
           res.json({userExists: true });
           
      } else {
        // User does not exist
        res.json({ userExists: false });
        
      }
      
  }
  module.exports = {userexist:userexist};