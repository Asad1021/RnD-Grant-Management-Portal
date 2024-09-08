const jwt = require("jsonwebtoken");

// const { searchAdmin } = require("../models/admin");
// const { searchProfessor } = require("../models/professor");
// const { searchStudent } = require("../models/student");
const { searchUser } = require("../models/users");

async function login(req, res) {
  // try {
  // Execute search queries for each user type
  // const adminResult = await searchAdmin(req.body.email);
  // const professorResult = await searchProfessor(req.body.email);
  // const studentResult = await searchStudent(req.body.email);

  // Check which result is not null and return it
  // if (adminResult.length > 0) { return adminResult;}
  // else if (professorResult.length > 0) { return professorResult;}
  // else if (studentResult.length > 0) { return studentResult;}
  // else { return null;}

  //   const userResult = await searchUser(req.body.email);
  //   console.log("in login")
  //   if (userResult.length > 0) return userResult;
  //   else return null;
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send("Internal Server Error");
  // }

  console.log("in login");
  const userResult = await searchUser(req.body.email);
  if (userResult.length > 0) return userResult;
  else throw new Error("User not found");
}

module.exports = {
  login,
};
