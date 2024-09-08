var express = require("express");
// const { delfellow } = require("../models/fellow");
var router = express.Router();
const fellow = require("../models/fellow");

async function addFellow(req, res) {
  try {
    const fellowResult = await fellow.addfellow(req);
    res.json(fellowResult).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getFellow(req, res) {
  try {
    const db_res = await fellow.getfellow(req);
    console.log(db_res);
    res.json(db_res).status(200);
  } catch (error) {
    console.log("error in controller fellow table getfellow", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function delFellow(req, res) {
  try {
    await fellow.deltfellow(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getFellow, addFellow, delFellow };
