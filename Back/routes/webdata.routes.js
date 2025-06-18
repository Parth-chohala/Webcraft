const Router = require("express").Router();
const multer = require("multer");
const webdataController = require("../controllers/webdataController");
const userAuth = require("../middlewares/user.auth");
const path = require("path");

// Disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1728812.png
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});


// Routes
// Router.get("/all", userAuth, webdataController.getAllWebData);
Router.get("/all", userAuth, webdataController.getWebDataForDashboard);
Router.get("/:id", userAuth, webdataController.getWebData);
Router.post("/add", userAuth, upload.single("thumbnail"), webdataController.addnewWebData);

Router.post("/dup/:id", userAuth, webdataController.duplicateWebdata);
Router.put("/:id", userAuth,upload.single("thumbnail"), webdataController.updateWebData);
Router.delete("/:id", userAuth, webdataController.deleteWebData);

module.exports = Router;
