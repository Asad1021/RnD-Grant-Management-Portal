var express = require("express");
var router = express.Router();
const summary = require("../models/summary_table");

async function getSummaryTable(req, res) {
  try {
    var db_res = await summary.getsummarytable(req);
    res.json(db_res).status(200);
  } catch (error) {
    console.log(
      "error in controller summary table getsummarytable",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
}

async function addSummary(req, res) {
  try {
    console.log("req:::::::::::::::");
    console.log(req);

    temp_res = await summary.addSummaries(req);
    res.json(temp_res.rows).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getMarkRead(req, res) {
  try {
    await summary.markread(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function editSanctioned(req, res) {
  try {
    await summary.editsanction(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getSummaryTable, addSummary, getMarkRead, editSanctioned };
