const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const middleware = require("../middleware");
const router = express.Router();

  
router.get("/",middleware.isLoggedOut, function (req, res) {
    res.render("login");
  });

router.post("/", function (req, res) {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    });
  });

module.exports = router;