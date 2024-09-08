var express = require("express");
var router = express.Router();
const pool = require("../database");
const proj = require("../models/project");
const summary_table = require("../models/summary_table");

async function createProject(req, res) {
  try {
    var sum_rec =
      parseInt(req.body.rec_sanctioned_amount) +
      parseInt(req.body.nonrec_sanctioned_amount);
    console.log(sum_rec);

    if (sum_rec != parseInt(req.body.grant)) {
      if (res)
        res.json(-1);
      else throw new Error("Sum of Rec and Non-Rec sanctioned amount should be equal to Grant amount");
    } else {
      var rec_total =
        parseInt(req.body.man_sanc) +
        parseInt(req.body.cons_sanc) +
        parseInt(req.body.travel_sanc) +
        parseInt(req.body.testing_sanc) +
        parseInt(req.body.overhead_sanc) +
        parseInt(req.body.unforseen_sanc) +
        parseInt(req.body.fab_sanc);
      var non_rec_total =
        parseInt(req.body.const_sanc) + parseInt(req.body.equip_sanc);
      console.log(rec_total);
      console.log("Consumables" + req.body.testing_sanc);
      console.log(non_rec_total);
      if (
        rec_total > parseInt(req.body.rec_sanctioned_amount) ||
        non_rec_total > parseInt(req.body.nonrec_sanctioned_amount)
      ) {
        if (res)
          res.json(-2);
        else throw new Error("Sum of Recurring and Non-Recurring sanctioned amount should be less than or equal to Recurring and Non-Recurring sanctioned amount respectively");
      } else {
        console.log(req.body);
        console.log("go to add projecct");
        try {
          await proj.addProject(req);
        } catch (error) {
          console.log(error);
          if (res)
            res.status(500).json({ success: false, error: error.message });
          else throw error;
        }
        console.log("\n\n go to the summaryComment");
        try {
          await summary_table.addSummaries(req);
        } catch (error) {
          console.log(error);
          if (res)
            res.status(500).json({ success: false, error: error.message });
          else throw error;
        }
        console.log("\n\n summary table ends\n\n");
        if(res)
        res.json(1).status(200);
      }
    }
  } catch (error) {
    console.error(error.message);
    if(res)
    res.status(500).json({ success: false, error: error.message });
    else throw error;
  }
}

async function approveProject(req, res) {
  try {
    console.log("in approveProject");
    await proj.appr_Project(req);
    res.json(1).status(200);
    // res.json({ success: true, message: "Project approved successfully." });
  } catch (error) {
    console.error("Error in approveProject:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to approve project." });
  }
}

async function delProject(req, res) {
  try {
    await proj.deleteProject(req);
    console.log("deleteProject ends");
    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
async function listOfProjects(req, res) {
  try {
    //running the select command
    const result = await proj.fetchProjects(req);
    res.json(result).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function showProjects(req, res) {
  try {
    const show = await proj.displayProject(req);
    res.json(show).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function specificProject(req, res) {
  try {
    const db_res = await proj.searchProject(req);
    const temp_json = db_res;

    console.log(temp_json.length);

    for (let step = 0; step < temp_json.length; step++) {
      temp_json[step].comment_time =
        temp_json[step].comment_time.toLocaleDateString("en-US") +
        " " +
        temp_json[step].comment_time.toLocaleTimeString("en-US");
    }

    console.log(temp_json);

    res.json(temp_json).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getProjectcolor(req, res) {
  try {
    const { summaryResult, mainResult } = await proj.projectcolor(req);
    const summarySum = summaryResult[0].sum || 0;
    const mainSum = mainResult ? mainResult[0].sum || 0 : 0;

    // Checking if either sum is greater than 0.
    if (summarySum > 0 || mainSum > 0) {
      await proj.updateCommflag(req);
      res.json(1);
    } else {
      // Sending response indicating no change in project color.
      res.json(0);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createProject,
  approveProject,
  listOfProjects,
  delProject,
  specificProject,
  showProjects,
  getProjectcolor,
};
