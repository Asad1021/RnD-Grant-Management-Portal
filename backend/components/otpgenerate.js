var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const pool = require("./db");
// Define a global object to store the OTPs


async function otpgenerate(req, res){
  const email = req.body.email;
  const emailString = String(email);
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
  
  // Store the OTP in the global object
  try {
    var result= await pool.query('delete from otp_table where email=$1', [email]);
    var result = await pool.query('INSERT INTO otp_table (email, otp) VALUES ($1, $2)', [email,otp]);
    // handle the results
  } catch (err) {
    // handle the error
    console.error(err);
  }
  console.log(otp);
  // Create a Nodemailer transporter with SMTP configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Replace with your SMTP host
    port: 587, // Replace with your SMTP port
    secure: false, // Set to true if using SSL/TLS
    auth: {
      user: 'sreyag123j@outlook.com', // Replace with your email address
      pass: '(a6BFS$Y$C_N-6y', // Replace with your email password
    },
    tls: {
      
      rejectUnauthorized: false
    },
    connectionTimeout: 5 * 60 * 1000,
    greetingTimeout: 5 * 60 * 1000,
    socketTimeout: 5 * 60 * 1000,
  });
  console.log("ggggggggggggggggggggggggg");
  // Define email options
  const mailOptions = {
    from: 'sreyag123j@outlook.com', // Replace with your email address
    to: '2020csb1124@iitrpr.ac.in', // Recipient email address
    subject: 'OTP Verification', // Email subject
    text: `Your OTP is: ${otp}`, // Email body
  };
  console.log("ggggggggggggggggggggggggg");
  // Send email with OTP
  await transporter.sendMail(mailOptions);

  // Send success response
  res.json({ success: true, otpSent: true }); 
  console.log("ggggggggggggggggggggggggg");
}

module.exports = { otpgenerate: otpgenerate};
