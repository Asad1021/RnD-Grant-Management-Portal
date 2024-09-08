const Pool = require("pg").Pool;

require("dotenv").config();

const pool = new Pool({
    user: "postgres",
    password: "alam1021",
    host: "localhost",
    port: 5432,
    database: process.env.DATABASE_NAME
} );

module.exports = pool;