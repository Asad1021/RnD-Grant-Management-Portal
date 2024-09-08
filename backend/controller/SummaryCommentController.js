var express = require("express");
// const { get } = require('../uploadfile');
var router = express.Router();
const summarycomment = require("../models/summaryComment"); // Corrected import statement

async function addSummaryComment(req, res) {
  try {
    await summarycomment.addsComment(req); // Corrected function call
    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getSummaryComment(req, res) {
  try {
    var temp_json = await summarycomment.getsComment(req); // Corrected function call
    // Formatting comment_time to a readable format
    for (let step = 0; step < temp_json.length; step++) {
      temp_json[step].comment_time =
        temp_json[step].comment_time.toLocaleDateString("en-US") +
        " " +
        temp_json[step].comment_time.toLocaleTimeString("en-US");
    }
    // console.log(temp_json);
    res.json(temp_json).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { addSummaryComment, getSummaryComment };
