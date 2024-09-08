var express = require('express');
var router = express.Router();
const pool = require("./db");

// async function addFund(req, res) {

//     try {
//         // first extracting the total of all the years 

//         var query = "SELECT * from "
//         query = query.concat(req.body.project_id)
//         query = query.concat("_summary_table WHERE heads = 'Total' ");

//         var db_res = await pool.query(query);

//         var feilds_arr = ["'Manpower(Recurring)'", "'Consumables(Recurring)'", "'Travel(Recurring)'", "'Field Testing/Demo/Tranings(Recurring)'", "'Overheads(Recurring)'", "'Unforseen Expenses(Recurring)'", "'Equipments(Non-Recurring)'", "'Construction(Non-Recurring)'", "'Fabrication(Recurring)'"]
//         var val_arr = [Number(req.body.manpower), Number(req.body.consumables), Number(req.body.travel), Number(req.body.field), Number(req.body.overheads), Number(req.body.unforseen), Number(req.body.equipments), Number(req.body.construction), Number(req.body.fabrication)]

//         if (db_res.rows[0].year_1_funds == 0) {

//             var total = 0;
//             for (let step = 0; step < 9; step++) {
//                 // updating the rows
//                 var query2 = "UPDATE ";
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table set ")
//                 query2 = query2.concat("year_1_funds =  ");
//                 query2 = query2.concat(val_arr[step]);
//                 query2 = query2.concat(" where heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2);
//                 deb_res = await pool.query(query2);

//                 // updating total balance 
//                 query2 = "SELECT * from "
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table WHERE heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2)
//                 db_res = await pool.query(query2);
//                 var to_update = val_arr[step] + db_res.rows[0].balance;

//                 var query2 = "UPDATE ";
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table set ")
//                 query2 = query2.concat("balance =  ");
//                 query2 = query2.concat(to_update);
//                 query2 = query2.concat(" where heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2);
//                 deb_res = await pool.query(query2);

//                 total = total + val_arr[step];


//             }
//             var query2 = "UPDATE ";
//             query2 = query2.concat(req.body.project_id)
//             query2 = query2.concat("_summary_table set ")
//             query2 = query2.concat("year_1_funds =  ");
//             query2 = query2.concat(total);
//             query2 = query2.concat(" where heads = 'Total'")

//             console.log(query2);
//             deb_res = await pool.query(query2);

//         }
//         else if (db_res.rows[0].year_2_funds == 0) {
//             var total = 0;
//             for (let step = 0; step < 9; step++) {
//                 // updating the rows
//                 var query2 = "UPDATE ";
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table set ")
//                 query2 = query2.concat("year_2_funds =  ");
//                 query2 = query2.concat(val_arr[step]);
//                 query2 = query2.concat(" where heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 deb_res = await pool.query(query2);
//                 total = total + val_arr[step];

//                 // updating total balance 
//                 query2 = "SELECT * from "
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table WHERE heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2)
//                 db_res = await pool.query(query2);
//                 var to_update = val_arr[step] + db_res.rows[0].balance;

//                 var query2 = "UPDATE ";
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table set ")
//                 query2 = query2.concat("balance =  ");
//                 query2 = query2.concat(to_update);
//                 query2 = query2.concat(" where heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2);
//                 deb_res = await pool.query(query2);

//             }
//             var query2 = "UPDATE ";
//             query2 = query2.concat(req.body.project_id)
//             query2 = query2.concat("_summary_table set ")
//             query2 = query2.concat("year_2_funds =  ");
//             query2 = query2.concat(total);
//             query2 = query2.concat(" where heads = 'Total'")
//             console.log(query2);
//             deb_res = await pool.query(query2);
//         }
//         else if (db_res.rows[0].year_3_funds == 0) {
//             var total = 0;
//             for (let step = 0; step < 9; step++) {
//                 // updating the rows
//                 var query2 = "UPDATE ";
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table set ")
//                 query2 = query2.concat("year_3_funds =  ");
//                 query2 = query2.concat(val_arr[step]);
//                 query2 = query2.concat(" where heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 deb_res = await pool.query(query2);

//                 total = total + val_arr[step];
//                 // updating total balance 
//                 query2 = "SELECT * from "
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table WHERE heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2)
//                 db_res = await pool.query(query2);
//                 var to_update = val_arr[step] + db_res.rows[0].balance;

//                 var query2 = "UPDATE ";
//                 query2 = query2.concat(req.body.project_id)
//                 query2 = query2.concat("_summary_table set ")
//                 query2 = query2.concat("balance =  ");
//                 query2 = query2.concat(to_update);
//                 query2 = query2.concat(" where heads = ")
//                 query2 = query2.concat(feilds_arr[step]);
//                 console.log(query2);
//                 deb_res = await pool.query(query2);

//             }
//             var query2 = "UPDATE ";
//             query2 = query2.concat(req.body.project_id)
//             query2 = query2.concat("_summary_table set ")
//             query2 = query2.concat("year_3_funds =  ");
//             query2 = query2.concat(total);
//             query2 = query2.concat(" where heads = 'Total'")
//             console.log(query2);
//             deb_res = await pool.query(query2);
//         }

//         var total = 0;
//         for (let step = 0; step < 9; step++) {
//             // updating total balance 
//             query2 = "SELECT * from "
//             query2 = query2.concat(req.body.project_id)
//             query2 = query2.concat("_summary_table WHERE heads = ")
//             query2 = query2.concat(feilds_arr[step]);
//             console.log(query2)
//             db_res = await pool.query(query2);
//             var total = total + db_res.rows[0].balance;

//         }
//         var query2 = "UPDATE ";
//         query2 = query2.concat(req.body.project_id)
//         query2 = query2.concat("_summary_table set ")
//         query2 = query2.concat("balance =  ");
//         query2 = query2.concat(total);
//         query2 = query2.concat(" where heads = 'Total'")
//         console.log(query2);
//         deb_res = await pool.query(query2);


//         // inserting row in expenditure table 
//         //inserting details in the project (main) table 
//         var query2 = "SELECT COUNT(*) FROM "
//         query2 = query2.concat(req.body.project_id)
//         query2 = query2.concat("_main_table")
//         var deb_res2 = await pool.query(query2);

//         var cnt = parseInt(deb_res2.rows[0].count) + 1;

//         console.log(cnt)

//         // finally updating the expenditure table 
//         var query = "INSERT INTO "
//         query = query.concat(req.body.project_id)
//         query = query.concat("_main_table VALUES ($1,$2,$3,$4,$5,NULL,$6,$7,0)");
//         db_res = await pool.query(query, [cnt, req.body.particulars, req.body.remarks, req.body.vouchno, req.body.rec, total, "Grant"]);

//         //returning 1 since everything was a success 
//         res.json(1);



//     } catch (error) {
//         console.error(error.message);
//     }

// }

async function addFund(req, res) {
    try {
        // Fetching the total of all the years from the summary_table for the specified project_id.
        const summaryQuery = `
            SELECT * 
            FROM summary_table 
            WHERE project_id = $1 AND heads = 'Total'
        `;
        const summaryResult = await pool.query(summaryQuery, [req.body.project_id]);
        const summaryRow = summaryResult.rows[0];

        const fields = [
            'Manpower(Recurring)',
            'Consumables(Recurring)',
            'Travel(Recurring)',
            'Field Testing/Demo/Tranings(Recurring)',
            'Overheads(Recurring)',
            'Unforeseen Expenses(Recurring)',
            'Equipments(Non-Recurring)',
            'Construction(Non-Recurring)',
            'Fabrication(Recurring)'
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
            req.body.fabrication
        ];
        if (summaryRow.year_1_funds == 0) {
            let total = 0;
            for (let i = 0; i < 9; i++) {
                // Updating the rows in the summary_table for the respective year.
                const updateSummaryQuery = `
                UPDATE summary_table 
                SET year_1_funds = $1 
                WHERE project_id = $2 AND heads = $3
            `;
                await pool.query(updateSummaryQuery, [values[i], req.body.project_id, fields[i]]);

                // Updating the total balance.
                const updateBalanceQuery = `
                UPDATE summary_table 
                SET balance = balance + $1
                WHERE project_id = $2 AND heads = $3
            `;
                await pool.query(updateBalanceQuery, [values[i], req.body.project_id, fields[i]]);

                total += values[i];
            }


            // Updating the total funds for the respective year in the summary_table.
            const updateTotalQuery = `
            UPDATE summary_table 
            SET year_1_funds = $1 
            WHERE project_id = $2 AND heads = 'Total'
        `;
            await pool.query(updateTotalQuery, [total, req.body.project_id]);

        }
        else if (summaryRow.year_2_funds == 0) {
            let total = 0;
            for (let i = 0; i < 9; i++) {
                // Updating the rows in the summary_table for the respective year.
                const updateSummaryQuery = `
                UPDATE summary_table 
                SET year_2_funds = $1 
                WHERE project_id = $2 AND heads = $3
            `;
                await pool.query(updateSummaryQuery, [values[i], req.body.project_id, fields[i]]);

                // Updating the total balance.
                const updateBalanceQuery = `
                UPDATE summary_table 
                SET balance = balance + $1
                WHERE project_id = $2 AND heads = $3
            `;
                await pool.query(updateBalanceQuery, [values[i], req.body.project_id, fields[i]]);

                total += values[i];
            }

            // Updating the total funds for the respective year in the summary_table.
            const updateTotalQuery = `
            UPDATE summary_table 
            SET year_2_funds = $1 
            WHERE project_id = $2 AND heads = 'Total'
        `;
            await pool.query(updateTotalQuery, [total, req.body.project_id]);
        }
        else if (summaryRow.year_3_funds == 0) {
            let total = 0;
            for (let i = 0; i < 9; i++) {
                // Updating the rows in the summary_table for the respective year.
                const updateSummaryQuery = `
                UPDATE summary_table 
                SET year_3_funds = $1 
                WHERE project_id = $2 AND heads = $3
            `;
                await pool.query(updateSummaryQuery, [values[i], req.body.project_id, fields[i]]);

                // Updating the total balance.
                const updateBalanceQuery = `
                UPDATE summary_table 
                SET balance = balance + $1
                WHERE project_id = $2 AND heads = $3
            `;
                await pool.query(updateBalanceQuery, [values[i], req.body.project_id, fields[i]]);

                total += values[i];
            }

            // Updating the total funds for the respective year in the summary_table.
            const updateTotalQuery = `
            UPDATE summary_table 
            SET year_3_funds = $1 
            WHERE project_id = $2 AND heads = 'Total'
        `;
            await pool.query(updateTotalQuery, [total, req.body.project_id]);
        }

        let total = 0;
        for (let step = 0; step < 9; step++) {
            // Fetching the balance for each category.
            const balanceQuery = `
        SELECT balance 
        FROM summary_table 
        WHERE project_id = $1 AND heads = $2
    `;
            const balanceResult = await pool.query(balanceQuery, [req.body.project_id, fields_arr[step]]);
            const balance = balanceResult.rows[0].balance;

            // Adding the balance to the total.
            total += balance;
        }

        // Updating the total balance in the summary table.
        const updateTotalBalanceQuery = `
    UPDATE summary_table 
    SET balance = $1 
    WHERE project_id = $2 AND heads = 'Total'
`;
        await pool.query(updateTotalBalanceQuery, [total, req.body.project_id]);


        // Counting the number of rows in the main table for the specified project_id.
        const countQuery = `
SELECT COUNT(*) AS count 
FROM Main_table 
WHERE project_id = $1
`;
        const countResult = await pool.query(countQuery, [req.body.project_id]);
        const cnt = parseInt(countResult.rows[0].count) + 1;

        console.log(cnt);

        // Inserting a new row into the main table for expenditure.
        const insertMainQuery = `
INSERT INTO Main_table 
(project_id, sr, particulars, remarks, vouchNo, rec, balance, heads, comm_flag, actual_flag) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
`;
        await pool.query(insertMainQuery, [req.body.project_id, cnt, req.body.particulars, req.body.remarks, req.body.vouchno, req.body.rec, total, "Grant", 0, 0]);

        // Returning success status.
        res.json(1).status(200);
    } catch (error) {
        console.error(error.message);
        // Returning error status.
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { addFund: addFund }