const { queryDatabase } = require("../database");

async function addSummaries(req) {
  console.log("summary table starts");
  let values;
  try {
    values = [
      [
        `\'${req.body.project_id}\'`,
        3,
        "'Manpower(Recurring)'",
        req.body.man_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        4,
        "'Consumables(Recurring)'",
        req.body.cons_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        5,
        "'Travel(Recurring)'",
        req.body.travel_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        6,
        "'Field Testing/Demo/Tranings(Recurring)'",
        req.body.testing_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        7,
        "'Overheads(Recurring)'",
        req.body.overhead_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        8,
        "'Unforseen Expenses(Recurring)'",
        req.body.unforseen_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        9,
        "'Equipments(Non-Recurring)'",
        req.body.equip_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        10,
        "'Construction(Non-Recurring)'",
        req.body.const_sanc,
      ],
      [
        `\'${req.body.project_id}\'`,
        11,
        "'Fabrication(Recurring)'",
        req.body.fab_sanc,
      ],
      [`\'${req.body.project_id}\'`, 12, "'Misc Rec.'", 10000000],
      [`\'${req.body.project_id}\'`, 13, "'Misc Non Rec.'", 10000000],
      [
        `\'${req.body.project_id}\'`,
        1,
        "'Rec.'",
        req.body.rec_sanctioned_amount,
      ],
      [
        `\'${req.body.project_id}\'`,
        2,
        "'Non-Rec.'",
        req.body.nonrec_sanctioned_amount,
      ],
      [`\'${req.body.project_id}\'`, 14, "'Total'", req.body.grant],
    ];
  } catch (error) {
    throw error;
  }

  const query = `
    INSERT INTO summary_table (project_id, sr, heads, sanctioned_amount, year_1_funds, year_2_funds, year_3_funds, expenditure, balance, comm_flag) 
    VALUES ${values
      .map((value) => `(${value.join(", ")}, 0, 0, 0, 0, 0, 0)`)
      .join(", ")}
`;

  console.log("summary table ends");
  try {
    await queryDatabase(query, []); // Corrected this line
  } catch (error) {
    console.error("Error adding summary comment:", error.message);
    throw error;
  }
}

async function getsummarytable(req) {
  // Constructing the SQL query to retrieve data from the summary table
  try {
    var query = `SELECT * FROM summary_table 
                 WHERE project_id = $1 
                 ORDER BY sr ASC`;

    // var project_id = req.body.project_id;
    // console.log(query + " " + req.body.project_id);
    const db_res = await queryDatabase(query, [req.body.project_id]);
    console.log(db_res[0].sanctioned_amount);

    return db_res;
  } catch (error) {
    // console.error(error.message);
    console.log("error in model summary table getsummarytable");
    throw error;
  }
}

async function markread(req) {
  try {
    if (req.body.is_admin == 1) {
      // Constructing the SQL query to update the comm_flag in summary_table
      var query1 = "UPDATE summary_table SET comm_flag = 0 WHERE sr = $1";
      await queryDatabase(query1, [req.body.row_no]);
      // console.log("comm_flag updated");

      // Constructing the SQL query to update the resolved field in summary_comment_table
      var query2 =
        "UPDATE summary_comment_table SET resolved = 'Yes' WHERE sr = $1";
      await queryDatabase(query2, [req.body.row_no]);
      console.log("resolved updated");
    }
  } catch (error) {
    console.error("Error in markread function:", error);
    throw error;
  }
}

async function editsanction(req) {
  try {
    // Constructing the SQL query to update sanctioned_amount in summary_table
    var query = `UPDATE summary_table 
                 SET sanctioned_amount = $1 
                 WHERE heads = $2 AND project_id = $3`;
    // Execute the SQL query with parameters
    const db_res = await queryDatabase(query, [
      req.body.sanc,
      req.body.heads,
      req.body.project_id,
    ]);
    var heads = req.body.heads;
    var sum = 0; // Define sum outside the conditions
    var ValuesQuery = "SELECT * FROM summary_table WHERE project_id = $1";
    var Values = await queryDatabase(ValuesQuery, [req.body.project_id]);
    // console.log("Values:", Values);
    if (heads != "Rec." && heads != "Non-Rec.") {
      for (let i = 0; i <= 13; i++) {
        const x = Values[i].sr;
        if (
          x == 3 ||
          x == 4 ||
          x == 5 ||
          x == 6 ||
          x == 7 ||
          x == 8 ||
          x == 11
        ) {
          sum += Values[i].sanctioned_amount;
        }
      }
      console.log(sum);
      // Update 'Rec' sanctioned_amount
      const recUpdateQuery =
        "UPDATE summary_table SET sanctioned_amount = $1 WHERE heads = 'Rec.' AND project_id = $2";
      const db_res_rec = await queryDatabase(recUpdateQuery, [
        sum,
        req.body.project_id,
      ]);
      console.log(db_res_rec);

      // Calculate sum for 'Non-Rec.'
      sum = 0;
      for (let i = 0; i <= 13; i++) {
        const x = Values[i].sr;
        if (x == 9 || x == 10) {
          sum += Values[i].sanctioned_amount;
        }
      }
      // Update 'Non-Rec.' sanctioned_amount
      const nonRecUpdateQuery =
        "UPDATE summary_table SET sanctioned_amount = $1 WHERE heads = 'Non-Rec.' AND project_id = $2";
      const db_res_nonRec = await queryDatabase(nonRecUpdateQuery, [
        sum,
        req.body.project_id,
      ]);
    }
    ValuesQuery = "SELECT * FROM summary_table WHERE project_id = $1";
    Values = await queryDatabase(ValuesQuery, [req.body.project_id]);
    if (heads != "Total") {
      sum = 0;
      for (let i = 0; i <= 13; i++) {
        const x = Values[i].sr;
        if (x == 1 || x == 2) {
          sum += Values[i].sanctioned_amount;
        }
      }
      // Update 'Total' sanctioned_amount
      var totalUpdateQuery =
        "UPDATE summary_table SET sanctioned_amount = $1 WHERE heads = 'Total' AND project_id = $2";
      var db_res_total = await queryDatabase(totalUpdateQuery, [
        sum,
        req.body.project_id,
      ]);
      totalUpdateQuery =
        "UPDATE projects SET project_grant = $1 WHERE project_id = $2";
      db_res_total = await queryDatabase(totalUpdateQuery, [
        sum,
        req.body.project_id,
      ]);
    }
  } catch (error) {
    console.error("Error in editsanction function:", error);
    throw error;
  }
}

module.exports = {
  addSummaries,
  getsummarytable,
  markread,
  editsanction,
};
