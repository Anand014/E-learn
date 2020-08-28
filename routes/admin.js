const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

router.get("/",middleware.isLoggedOut, function (req, res) {
    res.render("admin");
  });
  
router.post("/", function (req, res) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const checkadminPassword = req.body.verify;
  
    if (checkadminPassword === adminPassword) {
      res.render("newCourse");
    } else {
      res.redirect("admin");
    }
  });


  
  module.exports = router;
  
  