const { query } = require("express");
var express = require("express");
var router = express.Router();
const status = require("../models/status");
// to update the status of a specific project
async function updateStatus(req, res) {
  try {
    await status.updatestatus(req);
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { updateStatus };
