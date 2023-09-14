const multer = require("multer");
const env = require("dotenv");
env.config({ path: "../configs/.env" });
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
}
const upload = multer({
  dest: "../public/uploads",
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
});

module.exports = upload;
