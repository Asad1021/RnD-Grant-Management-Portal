const express = require("express");
const router = express.Router();
const { addUserFromXcel } = require("../models/file");
const xlsx = require("xlsx");
const multer = require("multer");
const upload = multer({
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

router.post(
  "/upload_users_file",
  upload.single("file"),
  async function (req, res, next) {
    try {
      const workbook = xlsx.read(req.file.buffer);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
      const users = await addUserFromXcel(data);
      res.json(users).status(200);
    } catch (error) {
      // console.log("error found");
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
