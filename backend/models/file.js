const { queryDatabase } = require("../database");

async function addUserFromXcel(data) {
  try {
    for (const row of data) {
      // your existing code here
      let querry = `
         INSERT INTO users (email_id, user_name, admin, department)
         VALUES ($1, $2, $3, $4)`;
      await queryDatabase(querry, [
        row.email_id,
        row.name,
        row.admin,
        row.department,
      ]);
    }
    const users = await queryDatabase("SELECT * from users", []);
    return users;
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

module.exports = {
  addUserFromXcel,
};
