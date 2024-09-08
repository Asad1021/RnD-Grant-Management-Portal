const { queryDatabase } = require("../database");

async function adfund(req) {
  try {
    // Fetching the total of all the years from the summary_table for the specified project_id.
    const summaryQuery = `
     SELECT * 
     FROM summary_table 
     WHERE project_id = $1 AND heads = 'Total'
 `;
    const summaryResult = await queryDatabase(summaryQuery, [
      req.body.project_id,
    ]);
    const summaryRow = summaryResult[0];

    const fields = [
      "Manpower(Recurring)",
      "Consumables(Recurring)",
      "Travel(Recurring)",
      "Field Testing/Demo/Tranings(Recurring)",
      "Overheads(Recurring)",
      "Unforeseen Expenses(Recurring)",
      "Equipments(Non-Recurring)",
      "Construction(Non-Recurring)",
      "Fabrication(Recurring)",
    ];

    const values = [
      req.body.manpower,
      req.body.consumables,
      req.body.travel,
      req.body.field,
      req.body.overheads,
      req.body.unforseen,
      req.body.equipments,
      req.body.construction,
      req.body.fabrication,
    ];
    if (summaryRow.year_1_funds == 0) {
      let total = 0;
      for (let i = 0; i < 9; i++) {
        const updateQuery = `
        UPDATE summary_table 
        SET year_1_funds = $1, balance = balance + $1
        WHERE project_id = $2 AND heads = $3
    `;
        await queryDatabase(updateQuery, [
          values[i],
          req.body.project_id,
          fields[i],
        ]);

        total += values[i];
      }

      // Updating the total funds for the respective year in the summary_table.
      const updateTotalQuery = `
     UPDATE summary_table 
     SET year_1_funds = $1 
     WHERE project_id = $2 AND heads = 'Total'
 `;
      await queryDatabase(updateTotalQuery, [total, req.body.project_id]);
    } else if (summaryRow.year_2_funds == 0) {
      let total = 0;
      for (let i = 0; i < 9; i++) {
        const updateQuery = `
        UPDATE summary_table 
        SET year_2_funds = $1, balance = balance + $1
        WHERE project_id = $2 AND heads = $3
    `;
        await queryDatabase(updateQuery, [
          values[i],
          req.body.project_id,
          fields[i],
        ]);

        total += values[i];
      }

      // Updating the total funds for the respective year in the summary_table.
      const updateTotalQuery = `
     UPDATE summary_table 
     SET year_2_funds = $1 
     WHERE project_id = $2 AND heads = 'Total'
 `;
      await queryDatabase(updateTotalQuery, [total, req.body.project_id]);
    } else if (summaryRow.year_3_funds == 0) {
      let total = 0;
      for (let i = 0; i < 9; i++) {
        const updateQuery = `
        UPDATE summary_table 
        SET year_2_funds = $1, balance = balance + $1
        WHERE project_id = $2 AND heads = $3
    `;
        await queryDatabase(updateQuery, [
          values[i],
          req.body.project_id,
          fields[i],
        ]);

        total += values[i];
      }

      // Updating the total funds for the respective year in the summary_table.
      const updateTotalQuery = `
     UPDATE summary_table 
     SET year_3_funds = $1 
     WHERE project_id = $2 AND heads = 'Total'
 `;
      await queryDatabase(updateTotalQuery, [total, req.body.project_id]);
    }

    let total = 0;
    for (let step = 0; step < 9; step++) {
      // Fetching the balance for each category.
      const balanceQuery = `
 SELECT balance 
 FROM summary_table 
 WHERE project_id = $1 AND heads = $2
`;
      const balanceResult = await queryDatabase(balanceQuery, [
        req.body.project_id,
        fields_arr[step],
      ]);
      const balance = balanceResult[0].balance;

      // Adding the balance to the total.
      total += balance;
    }

    // Updating the total balance in the summary table.
    const updateTotalBalanceQuery = `
UPDATE summary_table 
SET balance = $1 
WHERE project_id = $2 AND heads = 'Total'
`;
    await queryDatabase(updateTotalBalanceQuery, [total, req.body.project_id]);

    // Counting the number of rows in the main table for the specified project_id.
    const countQuery = `
SELECT COUNT(*) AS count 
FROM Main_table 
WHERE project_id = $1
`;
    const countResult = await queryDatabase(countQuery, [req.body.project_id]);
    const cnt = parseInt(countResult[0].count) + 1;

    console.log("Count is: "+cnt);

    // Inserting a new row into the main table for expenditure.
    const insertMainQuery = `
INSERT INTO Main_table 
(project_id, sr, particulars, remarks, vouchNo, rec, balance, heads, comm_flag, actual_flag) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
`;
    await queryDatabase(insertMainQuery, [
      req.body.project_id,
      cnt,
      req.body.particulars,
      req.body.remarks,
      req.body.vouchno,
      req.body.rec,
      total,
      "Grant",
      0,
      0,
    ]);
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

async function updatedFund(req) {
  try {
    // first extracting the total of all the years
    var query =
      "SELECT * from summary_table WHERE heads = 'Total' AND project_id = $1";
    var db_res = await queryDatabase(query, [req.body.project_id]);

    var feilds_arr = ["Rec.", "Non-Rec."];
    var val_arr = [Number(req.body.recur), Number(req.body.non_recur)];
    console.log(db_res[0]);
    console.log(db_res[0].year_1_funds==0);
    console.log(db_res[0].year_2_funds==0);
    console.log(db_res[0].year_3_funds==0);
    if (db_res[0].year_1_funds == 0) {
      var total = 0;
      // Loop through the first two items in val_arr
      for (let step = 0; step < 2; step++) {
        // Update year_1_funds for specific heads
        var query = `UPDATE summary_table 
                         SET year_1_funds = $1 
                         WHERE heads = $2 AND project_id = $3`;
        await queryDatabase(query, [val_arr[step], feilds_arr[step], req.body.project_id]);

        // Update balance
        query = `UPDATE summary_table 
                SET balance = balance + $1 
                WHERE heads = $2 AND project_id = $3`;
        await queryDatabase(query, [val_arr[step], feilds_arr[step], req.body.project_id]);
        // Update total
        total += val_arr[step];
      }

      // Update year_1_funds for the "Total" row
      var query = `UPDATE summary_table 
                     SET year_1_funds = $1 
                     WHERE heads = 'Total' AND project_id = $2`;
      await queryDatabase(query, [total, req.body.project_id]);
    } else if (db_res[0].year_2_funds == 0) {
      var total = 0;

      // Loop through the first two items in val_arr
      for (let step = 0; step < 2; step++) {
        // Update year_1_funds for specific heads
        var query = `UPDATE summary_table 
                         SET year_2_funds = $1 
                         WHERE heads = $2 AND project_id = $3`;
        await queryDatabase(query, [val_arr[step], feilds_arr[step], req.body.project_id]);

        // Update balance
        query = `UPDATE summary_table 
                SET balance = balance + $1 
                WHERE heads = $2 AND project_id = $3`;
        await queryDatabase(query, [val_arr[step], feilds_arr[step], req.body.project_id]);
        // Update total
        total += val_arr[step];
      }

      // Update year_1_funds for the "Total" row
      var query = `UPDATE summary_table 
                     SET year_2_funds = $1 
                     WHERE heads = 'Total' AND project_id = $2`;
      await queryDatabase(query, [total, req.body.project_id]);
    } else if (db_res[0].year_3_funds == 0) {
      var total = 0;

      // Loop through the first two items in val_arr
      for (let step = 0; step < 2; step++) {
        // Update year_1_funds for specific heads
        var query = `UPDATE summary_table 
                      SET year_3_funds = $1 
                      WHERE heads = $2 AND project_id = $3`;
        await queryDatabase(query, [val_arr[step], feilds_arr[step], req.body.project_id]);

        // Update balance
        query = `UPDATE summary_table 
                SET balance = balance + $1 
                WHERE heads = $2 AND project_id = $3`;
        await queryDatabase(query, [val_arr[step], feilds_arr[step], req.body.project_id]);
        // Update total
        total += val_arr[step];
      }

      // Update year_1_funds for the "Total" row
      var query = `UPDATE summary_table 
                  SET year_3_funds = $1 
                  WHERE heads = 'Total' AND project_id = $2`;
      await queryDatabase(query, [total, req.body.project_id]);
    }
    else{
      throw new Error("All years are already filled");
    }

    var totalBalance = 0;

    // Calculate total balance
    for (let step = 0; step < 2; step++) {
      var query = `SELECT balance FROM summary_table 
                         WHERE heads = $1 AND project_id = $2`;
      const db_res = await queryDatabase(query, [feilds_arr[step], req.body.project_id]);

      console.log([feilds_arr[step], req.body.project_id]);
      console.log("DEBUG");
      console.log(db_res);
      totalBalance += db_res[0].balance;
    }

    // Update total balance in the "Total" row
    var updateQuery = `UPDATE summary_table 
                           SET balance = $1 
                           WHERE heads = 'Total' AND project_id = $2`;
    await queryDatabase(updateQuery, [totalBalance, req.body.project_id]);

    // Insert row into the expenditure table
    var countQuery = `SELECT COUNT(*) FROM main_table WHERE project_id = $1`;
    var db_res2 = await queryDatabase(countQuery, [req.body.project_id]);
    var cnt = parseInt(db_res2[0].count) + 1;

    var insertQuery = `INSERT INTO main_table (project_id, sr, particulars, remarks, vouchNo, payment, balance, heads, comm_flag, actual_flag)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    await queryDatabase(insertQuery, [
      req.body.project_id,
      cnt,
      req.body.particulars,
      req.body.remarks,
      req.body.vouchno,
      Number(req.body.recur) + Number(req.body.non_recur),
      totalBalance,
      "Grant",
      0,
      0
    ]);

  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

module.exports = {
  adfund,
  updatedFund,
};
