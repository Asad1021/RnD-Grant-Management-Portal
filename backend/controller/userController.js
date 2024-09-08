var express = require("express");
var router = express.Router();


// const poola = require("../models/admin");
// const poolp = require("../models/professor");
// const pools = require("../models/student");
const users = require("../models/users");
async function addUser(req, res) {
  try {
    console.log(req.body);
    await users.addUser(req);
    const query = await users.getUser(req);
    res.json(query).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getUser(req, res) {
  try {
    //console.log("\n\n inside getuser");
    const query = await users.getUser(req);
    //console.log(query);
    res.json(query).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function delUser(req, res) {
  try {
    await users.deleteUser(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function specificuser(req, res) {
  try {
      const db_res = await users.getspecificUser(req);
      res.json(db_res).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function userexist(req, res) {
  try {
    
    const result = await users.existUser(req);
    // Check if any rows were returned
    if (result.rowCount > 0) {
      res.json({ userExists: true });
    } else {
      res.json({ userExists: false });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "An error occurred while checking user existence" });
  }
}

async function userType(req, res) {
  try {
    const { email } = req.params; 
    const dbRes = await users.searchUser(email);

    if (dbRes.length === 0) {
      res.json(-1);
    } else {
      const isAdmin = dbRes[0].admin;
      res.json(isAdmin);
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "An error occurred while determining user type" });
  }
}

module.exports = {
  addUser,
  getUser,
  delUser,
  specificuser,
  userexist,
  userType,
};
