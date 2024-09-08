var express = require('express');
var router = express.Router();
const pool = require("./db");

async function otpverify(req, res) {
    const { email, otp } = req.body;
    
    // Retrieve the stored OTP from the global object
    console.log(otp);
    // Check if the entered OTP matches the stored OTP
    const result = await pool.query('SELECT * FROM otp_table WHERE email=$1 and otp=$2',[email, otp]);
        if (result.rowCount > 0) {
      // Send success response
      console.log("otp verified. correct otp.");
      res.json({ success: true});
    } else {
      // Send error response
      console.log("incorrect otp");
      res.json({ success: false });
    }
  }

  module.exports = { otpverify: otpverify};
   