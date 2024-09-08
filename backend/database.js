// database.js
const Pool = require("pg").Pool;

require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

async function queryDatabase(sqlQuery, params) {
    try {
        const client = await pool.connect();
        const result = await client.query(sqlQuery, params);
        client.release();
        return result.rows;
    } catch (error) {
        // console.log("hello");
        throw error;
        // throw new Error(`Error querying the database: ${error}`);
        // console.log(error.message);
    }
}

module.exports = {
    queryDatabase
};
