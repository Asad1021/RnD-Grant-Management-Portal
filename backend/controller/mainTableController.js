var express = require("express");
const mainTable = require("../models/mainTable");


async function getMainTable(req, res) {
  try {
    console.log("maintable");
    // Executing the query with the specified project_id from the request body.
    const db_res = await mainTable.getmaintable(req);

    // Sending the fetched rows from the main table as a response.
    res.json(db_res).status(200);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

// to insert into a main table of a project
async function insertMainTable(req, res) {
  try {
    await mainTable.insertmaintable(req);
    res.json(1);
  } catch (error) {
    // Log any errors to the console
    console.log("Error here")
    res.status(500).json({ error: error.message });
  }
}


module.exports = { insertMainTable, getMainTable };
