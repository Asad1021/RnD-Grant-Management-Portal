const { queryDatabase } = require("../database");

async function getmaintable(req) {
  try {
    // Constructing the query to fetch details from the main table for the specified project_id.
    const query = `
        SELECT *
        FROM main_table
        WHERE project_id = $1
        ORDER BY sr ASC
      `;
    const params = [req.body.project_id];
    // Execute the query and wait for the result
    const Q = await queryDatabase(query, params);

    // console.log(req.body.project_id);
    // console.log(Q);
    return Q;
  } catch (error) {
    console.error("Error fetching data from the main_table:", error);
    throw error; // re-throw the error to propagate it further if necessary
  }
}

async function insertmaintable(req) {
  try {
    // Inserting details into the main_table for the project
    console.log("in insert main table")
    const query = `
          SELECT COUNT(*) FROM main_table WHERE project_id = $1;
      `;
    const countResult = await queryDatabase(query, [req.body.project_id]);
    const cnt = parseInt(countResult[0].count) + 1;

    // console.log('count = ' + cnt);

    // Checking whether we can add this expenditure or not!
    const summaryQuery = `
          SELECT * FROM summary_table WHERE project_id = $1 AND heads = $2;
      `;
    const summaryResult = await queryDatabase(summaryQuery, [req.body.project_id, req.body.heads2]);

    const tempExpenditure = summaryResult[0].expenditure + req.body.pay;
    const checkSanc = summaryResult[0].sanctioned_amount;

    // In case the sanctioned amount is less than the total current expenditure, then return -1
    if (tempExpenditure > checkSanc) {
      console.error("Expenditure exceeds the sanctioned amount!");
      throw new Error("Expenditure exceeds the sanctioned amount!");
      //res.json(-1);
    } else {
      // Adding expenditure and updating the summary_table balance and expenditure columns
      const updateBalanceExpenditureQuery = `
              UPDATE summary_table
              SET balance = balance - $1, expenditure = expenditure + $1
              WHERE project_id = $2 AND heads = $3;
          `;
      await queryDatabase(updateBalanceExpenditureQuery, [req.body.pay, req.body.project_id, req.body.heads]);

      // Updating the total balance and expenditure in the summary_table
        
      const sumQuerry = `
          SELECT SUM(balance) AS sum_bal, SUM(expenditure) AS sum_exp
          FROM summary_table
          WHERE project_id = $1
          AND heads IN ('Rec.', 'Non-Rec.');
        `;
      const sumResult = await queryDatabase(sumQuerry, [req.body.project_id]);
      let totalBalance = sumResult[0].sum_bal;
      let totalExpenditure = sumResult[0].sum_exp;



      // Updating the 'Total' row in the summary_table
      const updateTotalQuery = `
              UPDATE summary_table
              SET balance = $1, expenditure = $2
              WHERE project_id = $3 AND heads = 'Total';
          `;
      await queryDatabase(updateTotalQuery, [totalBalance, totalExpenditure, req.body.project_id]);

      // Finally, updating the main_table
      const insertMainTableQuery = `
    INSERT INTO main_table (project_id, sr, particulars, remarks, vouchNo, rec, payment, balance, heads, comm_flag, actual_flag)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $10, 0, $9)
`;

      await queryDatabase(insertMainTableQuery, [
        req.body.project_id,    // Value for project_id column
        cnt,                    // Value for sr column
        req.body.particulars,   // Value for particulars column
        req.body.remarks,       // Value for remarks column
        req.body.vouchno,       // Value for vouchNo column
        null,                   // Value for rec column (you might need to replace this with actual data)
        req.body.pay,           // Value for payment column
        totalBalance,           // Value for balance column
        req.body.actual,         // Value for actual_flag column
        req.body.heads2         // Value for heads column
      ]);

      const combinedQuery = `
      UPDATE summary_table
      SET expenditure = expenditure + $1
      WHERE project_id = $2 AND heads = $3
  `;

      // Executing the combined query
      queryDatabase(combinedQuery, [req.body.pay, req.body.project_id, req.body.heads2]);
      // Returning 1 if the operation was successful.
      
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}



module.exports = {
  getmaintable,
  insertmaintable,
  // updatesummarytable,
};
