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
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate('local', function(err, user) {
          if (err) {
             return next(err);
             }
          if (!user) {
             return res.redirect('/login'); 
            }
          req.logIn(user, function(err) {
            if (err) {
              return next(err); 
            }
            return res.redirect("/");
          });
        })(req, res);
      }
    });
  });

module.exports = router;