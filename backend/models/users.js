// student.js
const { queryDatabase } = require("../database");

async function addUser(req) {
  try {
    const sqlQuery =
      "INSERT INTO users (email_id, user_name, admin, department) VALUES ($1, $2, $3, $4)";
    const params = [
      req.body.email_id,
      req.body.name,
      req.body.admin,
      req.body.department.trim(),
    ];
    await queryDatabase(sqlQuery, params);
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}
async function getProfessors(){
  try {
    const sqlQuery = "SELECT email_id FROM users WHERE admin = 2";
    const params = [];
    const result = await queryDatabase(sqlQuery, params);
    return result;
  } catch (error) {
    console.error("Error getting professors:", error.message);
    throw error;
  }
}

async function deleteUser(req) {
  try {
    // Delete user from user_project table
    var query2 = "DELETE FROM user_project WHERE email_id = $1";
    var params2 = [req.body.e_id];
    await queryDatabase(query2, params2);
    console.log(query2);
    // Delete user from users table
    var query1 = "DELETE FROM users WHERE email_id = $1";
    var params1 = [req.body.e_id];
    await queryDatabase(query1, params1);

  } catch (error) {
    console.error("Error deleting user:", error.message);

    throw error;
  }
}
async function getUser(req) {
  try {

    var query="SELECT * from users" , params=[];
    const getUser = await queryDatabase(query, params);
    return getUser;
  } catch (error) {
    // console.error("Error adding user:", error.message);
    // res.status(500).json({ success: false, error: error.message });
    //  re-throw the error to propagate it to the calling function

    throw error;
  }
}
async function searchUser(email_id) {
  try {
    const sqlQuery = "SELECT * FROM users WHERE email_id = $1";
    const params = [email_id];
    const result = await queryDatabase(sqlQuery, params);

    // Construct the complete query string with parameter values
    const completeQuery = sqlQuery.replace(/\$[0-9]+/g, (match) => {
      const paramIndex = parseInt(match.slice(1)) - 1;
      return `'${params[paramIndex]}'`;
    });
    // console.log(result)
    return result;
  } catch (error) {
    console.error("Error searching user:", error.message);

    throw error;
  }
}

async function existUser(req) {
  try {
    const { email } = req.body;
    const result = await queryDatabase(
      "SELECT * FROM users WHERE email_id = $1",
      [email]
    );
    return result;
  } catch (error) {
    console.error("Error searching user:", error.message);

    throw error;
  }
}

async function getspecificUser(req) {
  try {
    let query = "",
      params;
    const type = req.body.type;
    let id = req.body.email.trim(); // Remove initial and trailing spaces
    let dept = req.body.department.trim(); // Remove initial and trailing spaces
    let result;

    if (type == 1) {
      query =
        "SELECT * FROM users WHERE lower(trim(email_id)) LIKE lower(trim($1))"; // Add trim function to both sides of comparison
      params = id;
    } else if (type == 2) {
      query =
        "SELECT * FROM users WHERE lower(trim(department)) LIKE lower(trim($1))"; // Add trim function to both sides of comparison
      params = dept;
    }

    console.log(query, id || dept);
    result = await queryDatabase(query, [params]);
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error searching user:", error.message);

    throw error;
  }
}

// Similarly implement editStudent and searchStudents

module.exports = {
  addUser,
  deleteUser,
  getUser,
  searchUser,
  existUser,
  getspecificUser,
  getProfessors
};
