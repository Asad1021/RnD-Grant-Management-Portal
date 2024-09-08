const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const multer = require("multer");
const ProjectController = require("./projectController");
const projectModel = require("../models/project");
const userModel = require("../models/users");


const upload = multer({
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});
const { queryDatabase } = require("../database");
const summary = require("../models/summary_table");

function convertSerialNumberToDate(serialNumber) {
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const daysSinceJan1st1900 = serialNumber - 25569;
  const dateInMilliseconds = daysSinceJan1st1900 * millisecondsInADay;
  // console.log("dateInMilliseconds: " + dateInMilliseconds);
  const date = new Date(dateInMilliseconds);
  // console.log("date: " + date);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear().toString();
  return `${year}-${month}-${day}`;
}
// To upload a file
router.post(
  "/upload_file",
  upload.single("file"),
  async function (req, res, next) {
    try {
      // Load the Excel sheet
      console.log("In upload file");
      const workbook = xlsx.read(req.file.buffer);
      const flag = req.body.flag;
      console.log("flag: " + flag);
      // console.log(typeof(flag))
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // console.log(workbook);
      // console.log(sheetName);
      // console.log(sheet);
      // Extract the data from the sheet
      const data = xlsx.utils.sheet_to_json(sheet);
      console.log(data);
      // Loop through the data and process each row
      WrongProfname = await checkValidProfessorName(data);
      WrongProjectId = await checkUniqueProjectId(data);
      // WrongPI = []
      WrongPI = await checkValidPI(data);
      // WrongCOPI = []
      WrongCOPI = await checkValidCoPI(data);
      WrongDept = await checkValidDept(data);
      WrongSumRec = await checkSumRec(data);
      WrongSumNonRec = await checkSumNonRec(data);
      WrongDate = await checkDate(data);
      WrongSumToGrant = await checkSumToGrant(data);

      if(WrongProfname.length > 0 || WrongProjectId.length > 0 || WrongPI.length > 0 || WrongCOPI.length > 0 || WrongDept.length > 0 || WrongSumRec.length > 0 || WrongSumNonRec.length > 0 || WrongDate.length > 0 || WrongSumToGrant.length > 0){
        res.status(500).json({WrongProfname, WrongProjectId, WrongPI, WrongCOPI, WrongDept, WrongSumRec, WrongSumNonRec, WrongDate, WrongSumToGrant});
        return;
      }

      for (row of data) {
        try {
          let req2 = {
            body: row,
          }
          // req2.body = row;
          req2.body.dos = convertSerialNumberToDate(req2.body.dos);
          console.log("req2: " + req2.body.dos);
          req2.body.doc = convertSerialNumberToDate(req2.body.doc);
          console.log("req2: " + req2.body.doc);
          req2.body.sanctioned_date = convertSerialNumberToDate(req2.body.sanctioned_date);
          console.log("req2: " + req2.body.sanctioned_date);
          req2.body.flag = parseInt(flag);
          console.log("req2.flag: " + req2.body.flag);
          await ProjectController.createProject(req2);
        } catch (error) {
          console.log("Error in Upload File: " + error.message);
          throw error;
        }
      }

      res.json(1);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// async function addSummary(row) {
//   console.log("summary table starts");
//   let values;
//   try {
//     values = [
//       [`\'${row.project_id}\'`, 3, "'Manpower(Recurring)'", row.man_sanc],
//       [`\'${row.project_id}\'`, 4, "'Consumables(Recurring)'", row.cons_sanc],
//       [`\'${row.project_id}\'`, 5, "'Travel(Recurring)'", row.travel_sanc],
//       [
//         `\'${row.project_id}\'`,
//         6,
//         "'Field Testing/Demo/Tranings(Recurring)'",
//         row.testing_sanc,
//       ],
//       [`\'${row.project_id}\'`, 7, "'Overheads(Recurring)'", row.overhead_sanc],
//       [
//         `\'${row.project_id}\'`,
//         8,
//         "'Unforseen Expenses(Recurring)'",
//         row.unforseen_sanc,
//       ],
//       [
//         `\'${row.project_id}\'`,
//         9,
//         "'Equipments(Non-Recurring)'",
//         row.equip_sanc,
//       ],
//       [
//         `\'${row.project_id}\'`,
//         10,
//         "'Construction(Non-Recurring)'",
//         row.const_sanc,
//       ],
//       [`\'${row.project_id}\'`, 11, "'Fabrication(Recurring)'", row.fab_sanc],
//       [`\'${row.project_id}\'`, 12, "'Misc Rec.'", 10000000],
//       [`\'${row.project_id}\'`, 13, "'Misc Non Rec.'", 10000000],
//       [`\'${row.project_id}\'`, 1, "'Rec.'", row.rec_sanctioned_amount],
//       [`\'${row.project_id}\'`, 2, "'Non-Rec.'", row.nonrec_sanctioned_amount],
//       [`\'${row.project_id}\'`, 14, "'Total'", row.grant],
//     ];
//   } catch (error) {
//     throw error;
//   }

//   const query = `
//     INSERT INTO summary_table (project_id, sr, heads, sanctioned_amount, year_1_funds, year_2_funds, year_3_funds, expenditure, balance, comm_flag) 
//     VALUES ${values
//       .map((value) => `(${value.join(", ")}, 0, 0, 0, 0, 0, 0)`)
//       .join(", ")}
// `;

//   console.log("summary table ends");
//   try {
//     await queryDatabase(query, []); // Corrected this line
//   } catch (error) {
//     console.error("Error adding summary comment:", error.message);
//     throw error;
//   }
// }
async function checkUniqueProjectId(projectList) {
  const projIds = await projectModel.getALlProjectId();
  const projIdsList = projIds.map((projId) => projId.project_id);
  // console.log(projIdsList);
  let ErrorArrayProjectId = []
  for (project of projectList) {
    // console.log(project.project_id);
    if (projIdsList.includes(project.project_id.toString())) {
      console.log("Project ID already exists: " + project.project_id);
      ErrorArrayProjectId.push(project.project_id);
    }
  }
  return ErrorArrayProjectId;
}
async function checkValidProfessorName(projectList) {
  const profIds = await userModel.getProfessors();
  // console.log(profIds);
  const profIdsList = profIds.map((profId) => profId.email_id);
  // console.log(profIdsList);
  let ErrorArrayProfessor = []
  for (project of projectList) {
    if (!profIdsList.includes(project.professors)) {
      console.log("Professor Name doesn't exist: " + project.professors);
      ErrorArrayProfessor.push(project.project_id);
    }
  }
  return ErrorArrayProfessor;
}
async function checkValidPI(projectList) {
  const profIds = await userModel.getProfessors();
  const profIdsList = profIds.map((profId) => profId.email_id);
  let ErrorArrayPI = []
  for (project of projectList) {
    if (!profIdsList.includes(project.pi)) {
      console.log("Professor Name doesn't exist for PI: " + project.pi);
      ErrorArrayPI.push(project.project_id);
    }
  }
  return ErrorArrayPI;
}
async function checkValidCoPI(projectList) {
  const profIds = await userModel.getProfessors();
  const profIdsList = profIds.map((profId) => profId.email_id);
  let ErrorArrayCOPI = []
  for (project of projectList) {
    if (!profIdsList.includes(project.co_pi)) {
      console.log("Professor Name doesn't exist for Co_Pi: " + project.co_pi);
      ErrorArrayCOPI.push(project.project_id);
    }
  }
  return ErrorArrayCOPI;
}
async function checkValidDept(projectList) {
 
  const deptList = ['CSE', 'CIVIL', 'CHEMISTRY', 'CHEMICAL ENGINEERING', 'ELECTRICAL', 'MECHANICAL', 'BIOMEDICAL', 'PHYSICS', 'MATH', 'HSS', 'MME'];
  let ErrorArrayDept = []
  for (project of projectList) {
    if (!deptList.includes(project.dept)) {
      console.log("Department doesn't exist: " + project.dept);
      ErrorArrayDept.push(project.project_id);
    }
  }
  return ErrorArrayDept;
}
async function checkSumRec(projectList) {
  let ErrorSumRec = [];
  for (project of projectList) {
    const sumRec =parseInt(project.man_sanc) +
    parseInt(project.cons_sanc) +
    parseInt(project.travel_sanc) +
    parseInt(project.testing_sanc) +
    parseInt(project.overhead_sanc) +
    parseInt(project.unforseen_sanc) +
    parseInt(project.fab_sanc);

    if (sumRec != parseInt(project.rec_sanctioned_amount)) {
      console.log("Sum of Rec sanctioned amount should be equal to Grant amount: " + project.project_id);
      ErrorSumRec.push(project.project_id);
    }
  }
  return ErrorSumRec;      
}
async function checkSumToGrant(projectList) {
  let ErrorSumToGrant = [];
  for (project of projectList) {
    const sumRec
    = parseInt(project.rec_sanctioned_amount) + parseInt(project.nonrec_sanctioned_amount);
    if (sumRec != parseInt(project.grant)) {
      console.log("Sum of Rec and Non-Rec sanctioned amount should be equal to Grant amount: " + project.project_id);
      ErrorSumToGrant.push(project.project_id);
    }
  }
  return ErrorSumToGrant;
}
async function checkSumNonRec(projectList) {
  let ErrorSumNonRec = [];
  for (project of projectList) {
    const nonRecTotal = parseInt(project.const_sanc) + parseInt(project.equip_sanc);
    if (nonRecTotal != parseInt(project.nonrec_sanctioned_amount)) {
      console.log("Sum of Non-Rec sanctioned amount should be equal to Grant amount: " + project.project_id);
      ErrorSumNonRec.push(project.project_id);
    }
  }
  return ErrorSumNonRec;
}
async function checkDate(projectList) {
  let ErrorDate = [];
  for(project of projectList){
    if(project.dos > project.doc){
      console.log("Date of start should be less than Date of completion: " + project.project_id);
      ErrorDate.push(project.project_id);
    }
  }
  return ErrorDate;
}
module.exports = router;
