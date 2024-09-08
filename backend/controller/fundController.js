var express = require("express");
var router = express.Router();
const fund = require("../models/fund");

async function addFund(req, res) {
  try {
    await fund.adfund(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updatedAddFund(req, res) {
  try {
    await fund.updatedFund(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { addFund, updatedAddFund };
