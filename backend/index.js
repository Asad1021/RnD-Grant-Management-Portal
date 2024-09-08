var express = require("express");
var app = express();

// const pool = require("./components/db");
const { login } = require("./controller/login");
require("dotenv").config();


const devconfig={
    user: "postgres",
    password: "alam1021",
    host: "localhost",
    port: 5432,
    database: "rnd"
}


const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};

// const pool = new Pool({

//     connectionString:"postgres://hjzkfaxfmpyjjo:6cf4a3fc572c16c2360d1536115d1d52abbfd38e7ca7b586b36a3a86330e4d67@ec2-52-54-212-232.compute-1.amazonaws.com:5432/d756afv3qeuka0",
//     ssl: {
//         rejectUnauthorized: false,
//     },
// } );

// module.exports = devconfig;



const userController = require("./controller/userController");
const projectController = require("./controller/projectController");
const maintableController = require("./controller/mainTableController");
const fellowController = require("./controller/fellowController");
const fundController = require("./controller/fundController");
const commentController = require("./controller/commentController");
const summaryController = require("./controller/summaryController");
const SummaryCommentController = require("./controller/SummaryCommentController");
const statusController = require("./controller/statusController");
const mainSummaryTableController = require("./controller/main_summary_tableController");
const otpController = require("./controller/otpController");
const backupController = require("./controller/backupController");



// const listOfProjects =  require('./controller/projectController/fetchAllProject');
// const user = require('./controller/userController/userController');
// const addFellow = require("./components/addFellow");
// const userType = require('./controller/userController/userType');
// const getFellow = require("./components/getFellow");
// const getMainTable = require("./components/getMainTable");
// const getSummaryTable = require("./components/getSummaryTable");
// const insertMainTable = require("./components/insertMainTable");
// const specificProject = require('./controller/projectController/specificProject');
// const createProject = require('./controller/projectController');
// const addFund = require("./components/addFund");
// const addComment = require("./controller/commentController");
// const getComment = require("./components/getComment");
// const showProjects = require('./controller/projectController/showProjects');
// const addSummaryComment = require("./components/addSummaryComment");
// const getSummaryComment = require("./components/getSummaryComment");
// const getMarkRead = require("./components/getMarkRead");
// const updatedAddFund = require("./components/updatedAddFund");
// const delrow = require("./components/delrow");
// const editSanctioned = require("./components/editSanctioned");
// const delUser = require('./controller/userController/delUser');
// const delFellow = require("./components/delFellow");
// const delProject = require('./controller/projectController/delProject');
// const apprProject = require('./projectController.approveProject');
// const ToActual = require("./components/ToActual");
// const userexist=require('./controller/userController/userexist');
// const updateStatus = require("./components/updateStatus");
// const specificuser = require('./controller/userController/specificuser');
const sendMail = require("./components/sendMail");
const otpgenerate = require("./components/otpgenerate");
// const getProjectcolor = require("./components/getProjectcolor");

// cors allows communication from differnt domains(requests to our server)
const cors = require("cors");


const PORT = process.env.PORT || 5000; // 5000 is a fallback value.. if PORT environment variable is not set


//creating middleware
app.use(cors());

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const otpverify = require("./components/otpverify");
const client = new OAuth2Client(
  // "84294184491-0n3vkd0vr2taefrmv0g5se53h4cbe2ds.apps.googleusercontent.com"
  "60491003338-csa5oo4a1o1d8jvp6ejcqq8dq80k2sf2.apps.googleusercontent.com"
);

//allowing us to extract json data from a request
app.use(express.json());

app.use(express.static("public"));

function verifyToken(req, res, next) {
  // extracting token from the header of the request
  const token = req.headers["jwt-token"];

  if (!token) {
    // if token not received then send a msg that we need token
    res.send("Please supply token");
  } else {
    // else verify that the token is correct

    jwt.verify(token, "jwtTempSecret", (err, authData) => {
      if (err) {
        res.status(500).json({
          auth: false,
          message: "authentication failure",
        });
      } else {
        //go to next in case the token is verified
        next();
      }
    });
  }
}

app.post("/test_temp", verifyToken, (req, res) => {
  res.json(699);
});

app.post("/authenticate", async function (req, res) {
  try {
    console.log("login");
    // the body that we received
    const query1 = await login(req, res);
    
    // if (query1.length == 0) {
    //   // if the user himself is not valid then send -1
    //   res.json(-1);
    // } 
    // else {
      console.log(req.body);
      const { token, email_id } = req.body;
      
      // verifying the google login sent


      const ticket = await client.verifyIdToken({
        idToken: token,
        audience:
          // "84294184491-0n3vkd0vr2taefrmv0g5se53h4cbe2ds.apps.googleusercontent.com",
          "60491003338-csa5oo4a1o1d8jvp6ejcqq8dq80k2sf2.apps.googleusercontent.com",
      });

      // making jwt token

      const jwt_token = jwt.sign({ email_id }, "jwtTempSecret", {
        // value 300 corresponds to 5 mins
        expiresIn: 18000,
      });

      res.json({
        auth: true,
        token: jwt_token,
        user_type: query1[0].admin,
      });
    // }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({message: error.message});
  }
});

//Routes

// const getUser = require('./components/getUser');
app.post("/checkUserExistence", userController.userexist);
app.get("/user/:email", verifyToken, userController.userType);
app.use(require("./controller/upload_project_file"));
app.use(require("./controller/upload_users_file"));
app.post("/user", verifyToken, userController.addUser);
app.post("/updatestatus", verifyToken, statusController.updateStatus);
app.post("/fellow", verifyToken, fellowController.addFellow);
app.post("/get_user", verifyToken, userController.getUser);
app.post("/get_fellow", verifyToken, fellowController.getFellow);
app.post("/get_main_table", verifyToken, maintableController.getMainTable);
app.post("/get_summary_table", verifyToken, summaryController.getSummaryTable);

app.post("/markread", verifyToken, summaryController.getMarkRead);

app.post(
  "/insert_main_table",
  verifyToken,
  maintableController.insertMainTable
);
app.post("/project",verifyToken ,projectController.listOfProjects);
app.post("/project_search", verifyToken, projectController.specificProject);
app.post("/create_project", verifyToken, projectController.createProject);
app.post("/fund", verifyToken, fundController.addFund);
app.post("/comment", verifyToken, commentController.addComment);
app.post("/sendMail", verifyToken, sendMail.sendMail);
app.post("/get_comment", verifyToken, commentController.getComment);
app.get("/project_prof/:email_id", verifyToken, projectController.showProjects);
app.post(
  "/summary_comment",
  verifyToken,
  SummaryCommentController.addSummaryComment
);
app.post(
  "/get_summary_comment",
  verifyToken,
  SummaryCommentController.getSummaryComment
);
app.post("/updated_add_fund", verifyToken, fundController.updatedAddFund);
app.get("/getProjectBackup",verifyToken, backupController.GetProjectBackup);
app.post("/del_row", verifyToken, mainSummaryTableController.delrow);
app.post("/edit_sanctioned", verifyToken, summaryController.editSanctioned);
app.post("/del_user", verifyToken, userController.delUser);
app.post("/del_fellow", verifyToken, fellowController.delFellow);
app.post("/del_project", verifyToken, projectController.delProject);
app.post("/appr_project", verifyToken, projectController.approveProject);
app.post("/to_actual", verifyToken, mainSummaryTableController.ToActual);
app.post("/user_search", userController.specificuser);
// app.post("/otp_generate", otpgenerate.otpgenerate);
// app.post("/otp_verify", otpverify.otpverify);
app.post("/generateOtp", otpController.generateOtp)
app.post("/verifyOtp", otpController.verifyOtp)
app.post("/getprojectcolor", verifyToken, projectController.getProjectcolor);
app.get("/final_deploy_test", (req, res) => {
  res.send("SERVER UP");
});

app.listen(PORT, function () {
  console.log("Listening ");
});
