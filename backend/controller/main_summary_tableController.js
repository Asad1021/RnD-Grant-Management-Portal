var express = require("express");
var router = express.Router();
const MainSummary = require("../models/main_summary");

async function ToActual(req, res) {
  try {
    await MainSummary.actual(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function delrow(req, res) {
  try {
    await MainSummary.deleterow(req);
    res.status(200).json({ success: true, message: "Entry deleted successfully"});

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  } 
}

module.exports = { ToActual, delrow };
