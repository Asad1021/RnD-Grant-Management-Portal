const express = require('express');
const router = express.Router();
const pool = require('../../components/db');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});

router.post('/upload_users_file', upload.single('file'), async function (req, res, next) {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      // your existing code here
      const db_res = await pool.query('INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING * ', [
        row.email_id,
        row.name,
        row.admin,
        row.department
      ] );
      
      if (row.admin == 2 || row.admin == 3) {
        console.log("hi");
        const email = row.email_id;
        console.log("hi1");
        const index = email.indexOf('@');
        const str_query = `CREATE TABLE p_${email.substring(0, index)}_proj_list (project_id text, project_title text, professor_list text, project_grant integer, comment_time timestamp with time zone, pi text, co_pi text, dept text, fund_agency text, sanc_order_no text, sanctioned_date text, duration text, dos text, doc text, start_year text, is_appr integer default 0)`;
        await pool.query(str_query);
      }
    }

   

    const db_res2 = await pool.query('SELECT * from users');
    res.json(db_res2.rows);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;