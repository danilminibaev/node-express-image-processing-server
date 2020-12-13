const express = require("express");
const multer = require("multer");
const { response } = require("../app");
const path = require("path");

const imageProcessor = require("./imageProcessor");

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

router.post("/upload", upload.single("photo"), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }

  try {
    await imageProcessor(req.file.filename);
  } catch (error) {}

  return res.status(201).json({ success: true });
});

const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html");

router.get("/photo-viewer", (req, res) => {
  res.sendFile(photoPath);
});

module.exports = router;
