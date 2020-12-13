const express = require("express");
const multer = require("multer");
const { response } = require("../app");

const router = express.Router();

function filename(req, file, callback) {
  callback(null, file.originalname);
}

const storage = multer.diskStorage({ destination: "api/uploads/", filename });

function fileFilter(req, file, callback) {
  if (file.mimetype !== "image/png") {
    req.fileValidationError = "Wrong file type";
    callback(null, false, new Error("Wrong file type"));
  } else {
    callback(null, true);
  }
}

const upload = multer({ fileFilter, storage });

router.post("/upload", upload.single("photo"), (req, res) => {
  if (req.fileValidationError) {
    res.status(400).json({ error: req.fileValidationError });
  } else {
    res.status(201).json({ success: true });
  }
});

module.exports = router;
