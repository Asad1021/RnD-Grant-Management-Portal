const { queryDatabase } = require("../database");
const nodemailer = require("nodemailer");
require("dotenv").config();
/*create table OTPs(
    email_id text PRIMARY KEY,
    otp text,
    createTime TIMESTAMP with time zone,
    endTime TIMESTAMP with time zone
);*/
async function generateOtp(req) {
    try {
        const FindUser = `
            SELECT * FROM users
            WHERE email_id = $1
        `;
        const params = [req.body.email_id];
        const result = await queryDatabase(FindUser, params);
        if (result.length == 0) {
        throw new Error("Not found, please contact admin at dep.p03.2024@gmail.com ");
        }

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log("Generated OTP:", otp);
        //find if email id already exits in Db
        const FindUserOtp = `
            SELECT * FROM OTPs
            WHERE email_id = $1
        `;
        const params1 = [req.body.email_id];
        const result1 = await queryDatabase(FindUserOtp, params1);
        if (result1.length != 0) {
            // Update the OTP in the OTPs table
            const UpdateOtpToDB = `
                UPDATE OTPs
                SET otp = $1, createTime = NOW(), endTime = NOW() + INTERVAL '5 minutes'
                WHERE email_id = $2
            `;
            const params2 = [otp.toString(), req.body.email_id];
            await queryDatabase(UpdateOtpToDB, params2);
        } else {
            // Insert the OTP in the OTPs table
            const InsertOtpToDB = `
                INSERT INTO OTPs (email_id, otp, createTime, endTime)
                VALUES ($1, $2, NOW(), NOW() + INTERVAL '5 minutes')
            `;
            const params3 = [req.body.email_id, otp.toString()];
            await queryDatabase(InsertOtpToDB, params3);
        }
        // Send the OTP to the user
        await sendOtpToUser(req.body.email_id, otp);
        return { success: true, message: "OTP sent successfully" };
    } catch (error) {
        console.error("Error fetching data from the users table:", error);
        throw error; // re-throw the error to propagate it further if necessary
    }
}

async function sendOtpToUser(email_id, otp) {   
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dep.p03.2024@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        },
    });
    const option = {
        from: 'dep.p03.2024@gmail.com',
        to: email_id,
        subject: 'OTP for verification',
        text: `Your OTP for verification is ${otp}. It is valid for only 5 minutes.`
    };
    await transporter.sendMail(option,function(err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {
            // console.log('Email sent!!!',data);
        }
    });
}

async function verifyOtp(req) {
    try {
        const FindUserOtp = `
            SELECT * FROM OTPs
            WHERE email_id = $1
        `;
        const params1 = [req.body.email_id];
        const result1 = await queryDatabase(FindUserOtp, params1);
        if (result1.length == 0) {
            throw new Error("OTP not found!");
        }
        if (result1[0].otp == req.body.otp && result1[0].endtime > new Date() ) {
            const FindUser = `
                SELECT * FROM users
                WHERE email_id = $1
            `;
            const params = [req.body.email_id];
            const result = await queryDatabase(FindUser, params);

            return { success: true , user: result[0]};
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error; // re-throw the error to propagate it further if necessary
    }
}


module.exports = {
    generateOtp,
    verifyOtp
}