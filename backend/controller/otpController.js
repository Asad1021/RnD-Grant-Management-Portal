const otpServices = require('../models/otpServices');
const jwt = require("jsonwebtoken");

async function generateOtp(req, res) {
    if (req.body.email_id == undefined || req.body.email_id == "") {
        res.status(400).json({ success: false, error: "Email id is required" });
        return;
    }
    try {
        const result = await otpServices.generateOtp(req);
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ success: false, error: error.message });
    }
}
async function verifyOtp(req, res) {
    if (req.body.otp == undefined || req.body.email_id == undefined) {
        res.status(400).json({ success: false, error: "OTP and RequestId is required" });
        return;
    }
    try {
        const result = await otpServices.verifyOtp(req);
        if (result.success === true) {
            // const { email_id, userName, userImg, userFlag } = result.user;
            const email_id = req.body.email_id;
            const jwt_token = jwt.sign({ email_id }, "jwtTempSecret", {
                // value 300 corresponds to 5 mins
                expiresIn: 18000,
            });

            res.json({
                auth: true,
                token: jwt_token,
                user_name: result.user.user_name,
                user_email: result.user.email_id,
                user_type: result.user.admin,
                // user: {
                //     userName,
                //     email_id,
                //     userImg,
                //     userFlag
                // }
            });
        }
        else {
            res.json({ auth: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ auth: false, error: error.message });
    }
}

module.exports = {
    generateOtp,
    verifyOtp
}