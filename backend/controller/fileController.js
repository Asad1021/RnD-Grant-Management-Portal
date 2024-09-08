
// const express = require('express');
// const router = express.Router();
// const pool = require('../components/db');
// const xlsx = require('xlsx');
// const multer = require('multer');
// const upload = multer({
//   onError: function (err, next) {
//     console.log('error', err);
//     next(err);
//   },
// });

// // To upload a file
// router.post('/upload_file', upload.single('file'), async function (req, res, next) {
//   try {
//     // Load the Excel sheet
//     console.log('hi');
//     const workbook = xlsx.read(req.file.buffer);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     console.log('hi');
//     // Extract the data from the sheet
//     const data = xlsx.utils.sheet_to_json(sheet);

//     // Loop through the data and process each row
//     for (const row of data) {
//       const sumRec =
//         parseInt(row.rec_sanctioned_amount) + parseInt(row.nonrec_sanctioned_amount);
//       console.log(sumRec);
//       if (sumRec !== parseInt(row.grant)) {
//         res.json(-1);
//         return;
//       }

//       const recTotal =
//         parseInt(row.man_sanc) +
//         parseInt(row.cons_sanc) +
//         parseInt(row.travel_sanc) +
//         parseInt(row.testing_sanc) +
//         parseInt(row.overhead_sanc) +
//         parseInt(row.unforseen_sanc) +
//         parseInt(row.fab_sanc);
//       const nonRecTotal = parseInt(row.const_sanc) + parseInt(row.equip_sanc);
//       console.log(recTotal);
//       console.log('Consumables(Recurring)' + row.testing_sanc);
//       console.log(nonRecTotal);
//       if (
//         recTotal > parseInt(row.rec_sanctioned_amount) ||
//         nonRecTotal > parseInt(row.nonrec_sanctioned_amount)
//       ) {
//         res.json(-2);
//         return;
//       }

//       function convertSerialNumberToDate(serialNumber) {
//         const millisecondsInADay = 24 * 60 * 60 * 1000;
//         const daysSinceJan1st1900 = serialNumber - 25569;
//         const dateInMilliseconds = daysSinceJan1st1900 * millisecondsInADay;
//         const date = new Date(dateInMilliseconds);
//         const day = date.getUTCDate().toString().padStart(2, '0');
//         const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//         const year = date.getUTCFullYear().toString();
//         return `${year}-${month}-${day}`;
//       }
//       row.sanctioned_date=convertSerialNumberToDate(row.sanctioned_date);
//       console.log(convertSerialNumberToDate(row.sanctioned_date));
//       row.doc=convertSerialNumberToDate(row.doc);
//       console.log(convertSerialNumberToDate(row.doc));
//       row.dos=convertSerialNumberToDate(row.dos);
//       function diffInMonthsAndDays(startDate, endDate) {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
      
//         let yearDiff = end.getFullYear() - start.getFullYear();
//         let monthDiff = end.getMonth() - start.getMonth();
//         let dayDiff = end.getDate() - start.getDate();
      
//         if (dayDiff < 0) {
//           const daysInLastMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
//           dayDiff = daysInLastMonth - start.getDate() + end.getDate();
//           monthDiff -= 1;
//         }
      
//         if (monthDiff < 0) {
//           monthDiff = 12 - start.getMonth() + end.getMonth();
//           yearDiff -= 1;
      
//           if (dayDiff < 0) {
//             const daysInLastMonth = new Date(end.getFullYear(), end.getMonth() - 1, 0).getDate();
//             dayDiff = daysInLastMonth - start.getDate() + end.getDate();
//             monthDiff -= 1;
//           }
//         }
      
//         let formattedYearDiff = yearDiff > 0 ? yearDiff + " year" + (yearDiff > 1 ? "s" : "") + ", " : "";
//         let formattedMonthDiff = monthDiff > 0 ? monthDiff + " month" + (monthDiff > 1 ? "s" : "") + ", " : "";
//         let formattedDayDiff = dayDiff > 0 ? dayDiff + " day" + (dayDiff > 1 ? "s" : "") : "";
      
//         return formattedYearDiff + formattedMonthDiff + formattedDayDiff;
//       }
      
      
//       row.duration=diffInMonthsAndDays(row.dos,row.doc);
//       // project_id = project_id.toString();

//       // Running the insert command
//             let statusValue;
//       if (typeof row.status === "string") {
//         if (row.status.toLowerCase() === "completed") {
//           statusValue = 1;
//         } else if (row.status.toLowerCase() === "running") {
//           statusValue = 0;
//         }
//       } else {
//         statusValue = row.status;
//       }

//       const dbRes = await pool.query(
//         'INSERT INTO projects (project_id, project_title, professor_list, project_grant, comment_time, pi, co_pi, dept, fund_agency, sanc_order_no, sanctioned_date, duration, dos, doc, start_year, is_appr, is_running) VALUES ($1, $2, $3, $4, current_timestamp, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 0, $15)',
//         [ row.project_id, row.project_title, row.professors, row.grant, row.pi, row.co_pi, row.dept, row.fund_agency, row.sanc_order_no, row.sanctioned_date, row.duration, row.dos, row.doc, row.start_year, statusValue ]
//       );


//       // Now corresponding to each professor, we need to make an entry in his corresponding project table
//       const profEmails = row.professors.split(',');
//       for (const email of profEmails) {
//         console.log("123")
//         // Extracting the email before @
//         const index = email.indexOf('@');
//         let profId = email.substring(0, index);
//         profId = profId.replace('.', 'dot');
//         console.log(profId);
//         let query = `INSERT INTO p_${profId}_proj_list (project_id, project_title, professor_list, project_grant, comment_time, pi, co_pi, dept, fund_agency, sanc_order_no, sanctioned_date, duration, dos, doc, start_year, is_appr, is_running)VALUES ($1, $2, $3, $4, current_timestamp, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 0, $15)`;
//         const dbRes2 = await pool.query(query, [
//           row.project_id,
//           row.project_title,
//           row.professors,
//           row.grant,
//           row.pi,
//           row.co_pi,
//           row.dept,
//           row.fund_agency,
//           row.sanc_order_no,
//           row.sanctioned_date,
//           row.duration,
//           row.dos,
//           row.doc,
//           row.start_year,
//           statusValue,
//         ]);
//     }
    

//                 query="CREATE TABLE ";
//                 query=query.concat(row.project_id)
//                 query=query.concat("_main_table (sr int , particulars text , remarks text ,vouchNo text, rec text , payment int , balance int , heads text , comm_flag int , actual_flag int) ")
//                 deb_res = await pool.query(query)

//                 // creating the comments table 
//                 query = "CREATE TABLE "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")
//                 deb_res = await pool.query(query)

//                 query = "CREATE TABLE "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_fellow_table (email text)")
//                 deb_res = await pool.query(query)

//                 // creating the sumarry table
//                 query="CREATE TABLE ";
//                 query=query.concat(row.project_id)
//                 query=query.concat("_summary_table (sr int , heads text , sanctioned_amount int ,year_1_funds int,year_2_funds int , year_3_funds int ,expenditure int , balance int , comm_flag int) ")
//                 deb_res = await pool.query(query)

//                 // creating the comment table for the summary table
//                 query = "CREATE TABLE "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_comment_table (sr int,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")

//                 deb_res = await pool.query(query)

//                 // now inserting the initial rows in the table 
//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (3,'Manpower(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.man_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (4,'Consumables(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.cons_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (5,'Travel(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.travel_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (6,'Field Testing/Demo/Tranings(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.testing_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (7,'Overheads(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.overhead_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (8,'Unforseen Expenses(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.unforseen_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (9,'Equipments(Non-Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.equip_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (10,'Construction(Non-Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.const_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (11,'Fabrication(Recurring)',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.fab_sanc])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (12,'Misc Rec.',10000000,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query)

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (13,'Misc Non Rec.',10000000,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query)

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (1,'Rec.',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.rec_sanctioned_amount])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (2,'Non-Rec.',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.nonrec_sanctioned_amount])

//                 query = "INSERT INTO "
//                 query = query.concat(row.project_id)
//                 query = query.concat("_summary_table VALUES (14,'Total',$1,0,0,0,0,0,0)");
//                 deb_res = await pool.query(query,[row.grant])
     
//   }
  
//   res.json(1);
// } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//     }
//     });
    
//     module.exports = router; 


//     const express = require('express');
//     const router = express.Router();
//     const pool = require('../components/db');
//     const xlsx = require('xlsx');
//     const multer = require('multer');
//     const upload = multer({
//       onError: function (err, next) {
//         console.log('error', err);
//         next(err);
//       },
//     });
    
//     router.post('/upload_users_file', upload.single('file'), async function (req, res, next) {
//       try {
//         const workbook = xlsx.read(req.file.buffer);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(sheet);
    
//         for (const row of data) {
//           // your existing code here
//           const db_res = await pool.query('INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING * ', [
//             row.email_id,
//             row.name,
//             row.admin,
//             row.department
//           ] );
          
//           if (row.admin == 2 || row.admin == 3) {
//             console.log("hi");
//             const email = row.email_id;
//             console.log("hi1");
//             const index = email.indexOf('@');
//             const str_query = `CREATE TABLE p_${email.substring(0, index)}_proj_list (project_id text, project_title text, professor_list text, project_grant integer, comment_time timestamp with time zone, pi text, co_pi text, dept text, fund_agency text, sanc_order_no text, sanctioned_date text, duration text, dos text, doc text, start_year text, is_appr integer default 0)`;
//             await pool.query(str_query);
//           }
//         }
    
       
    
//         const db_res2 = await pool.query('SELECT * from users');
//         res.json(db_res2.rows);
//       } catch (error) {
//         console.error(error.message);
//       }
//     });
    
//     module.exports = router;