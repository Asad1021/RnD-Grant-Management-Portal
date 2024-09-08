var express = require("express");
var router = express.Router();
const comment = require("../models/comment");

async function addComment(req, res) {
  try {
    // Adding a comment for a particular project.
    await comment.addcomment(req);

    // Updating the row of the Main_table where the comment has been made, setting the comm_flag to 1.
    if (req.body.is_admin === 2 || req.body.is_admin === 3) {
      await comment.maintableupdate(req);
    }

    // Updating the projects table to set comment_time to current_timestamp.
    await comment.projectTableUpdate(req);

    res.json(1).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getComment(req, res) {
  try {
    const temp_json = await comment.getcomment(req);

    for (let step = 0; step < temp_json.length; step++) {
      temp_json[step].comment_time =
        temp_json[step].comment_time.toLocaleDateString("en-US") +
        " " +
        temp_json[step].comment_time.toLocaleTimeString("en-US");
    }

    console.log(temp_json);

    //returning all the rows
    res.json(temp_json).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { addComment, getComment };
