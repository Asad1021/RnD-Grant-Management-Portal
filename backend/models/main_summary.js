const { queryDatabase } = require("../database");

async function actual(req) {
  try {
    const { p_id, sr, old_pay, new_pay, heads } = req.body;

    // Update payment field in _main_table
    let query = `UPDATE main_table SET payment = $1 WHERE sr = $2 AND project_id = $3`;
    await queryDatabase(query, [new_pay, sr, p_id]);

    // Set actual_flag to 0 in _main_table
    query = `UPDATE main_table SET actual_flag = 0 WHERE sr = $1 AND project_id = $2`;
    await queryDatabase(query, [sr, p_id]);

    // Calculate difference in payment amounts
    const paymentDifference = parseInt(new_pay) - parseInt(old_pay);

    // Update balance in _main_table
    query = `UPDATE main_table SET balance = balance - $1 WHERE sr >= $2 AND project_id = $3`;
    await queryDatabase(query, [paymentDifference, sr, p_id]);

    // Update expenditure in _summary_table
    query = `UPDATE summary_table SET expenditure = expenditure + $1 WHERE heads = $2 AND project_id = $3`;
    await queryDatabase(query, [paymentDifference, heads, p_id]);

    // Update balance and expenditure in _summary_table based on heads
    if (
      heads === "Equipments(Non-Recurring)" ||
      heads === "Construction(Non-Recurring)" ||
      heads === "Misc Non Rec."
    ) {
      // Non-recurring
      query = `UPDATE summary_table SET balance = balance - $1, expenditure = expenditure + $1 WHERE heads = 'Non-Rec.' AND project_id = $2`;
    } else {
      // Recurring
      query = `UPDATE summary_table SET balance = balance - $1, expenditure = expenditure + $1 WHERE heads = 'Rec.' AND project_id = $2`;
    }
    await queryDatabase(query, [paymentDifference, p_id]);

    // Update balance and expenditure for 'Total' in _summary_table
    query = `UPDATE summary_table SET expenditure = expenditure + $1, balance = balance - $1 WHERE heads = 'Total' AND project_id = $2`;
    await queryDatabase(query, [paymentDifference, p_id]);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function deleterow(req) {
  try {
    // Extracting project_id and sr from req.body
    const { heads, project_id, sr } = req.body;
    console.log("heads");
    console.log(heads);
    console.log("project_id");
    console.log(project_id);
    console.log("sr");
    console.log(sr);
    // Extracting balance and payment from the main table
    const queryMainTable = `SELECT balance, payment FROM main_table WHERE sr = $1 AND project_id = $2`;
    const db_resMainTable = await queryDatabase(queryMainTable, [sr, project_id]);
    const { balance, payment } = db_resMainTable[0];

    console.log("balance " + balance + " payment " + payment);

    // Deleting the row with the given sr
    const deleteQuery = `DELETE FROM main_table WHERE sr = $1 AND project_id = $2 `;

    await queryDatabase(deleteQuery, [sr, project_id]);

    // Updating balance for remaining rows
    const updateBalanceQuery = `UPDATE main_table SET balance = balance + $1 WHERE sr > $2 AND project_id = $3`;
    await queryDatabase(updateBalanceQuery, [payment, sr, project_id]);

    // Updating serial numbers for remaining rows
    const updateSerialQuery = `UPDATE main_table SET sr = sr - 1 WHERE sr > $1 AND project_id = $2`;
    await queryDatabase(updateSerialQuery, [sr, project_id]);

    // Updating expenditure in summary table
    const updateExpenditureQuery = `UPDATE summary_table SET expenditure = expenditure - $1 WHERE heads = $2 AND project_id = $3`;
    await queryDatabase(updateExpenditureQuery, [payment, heads, project_id]);

    // Handling non-recurring and recurring cases
    if (
      heads === "Equipments(Non-Recurring)" ||
      heads === "Construction(Non-Recurring)"
    ) {
      const updateNonRecBalanceQuery = `UPDATE summary_table SET balance = balance + $1, expenditure = expenditure - $1 WHERE heads = 'Non-Rec.' AND project_id = $2`;
      await queryDatabase(updateNonRecBalanceQuery, [payment, project_id]);
    } else {
      const updateRecBalanceQuery = `UPDATE summary_table SET balance = balance + $1, expenditure = expenditure - $1 WHERE heads = 'Rec.' AND project_id = $2`;
      await queryDatabase(updateRecBalanceQuery, [payment, project_id]);

      // Update 'Total' row in summary table

      const updateTotalQuery = `UPDATE summary_table SET balance = balance + $1, expenditure = expenditure - $1 WHERE heads = 'Total' AND project_id = $2`;
      await queryDatabase(updateTotalQuery, [payment, project_id]);

    }
    const updateTotalQuery = `UPDATE summary_table SET balance = balance + $1, expenditure = expenditure - $1 WHERE heads = 'Total' AND project_id = $2`;
    await queryDatabase(updateTotalQuery, [payment,project_id]);
      
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

module.exports = { actual, deleterow };
