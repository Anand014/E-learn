const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const middleware = require("../middleware");
const router = express.Router();


router.get("/",middleware.isLoggedOut, function (req, res) {
    res.render("register");
});

router.post("/", function (req, res) {
   User.register(
     { name: req.body.name, username: req.body.username },
     req.body.password,
     function (err, user) {
       if (err) {
         console.log(err);
         res.redirect("/register");
       } else {
         passport.authenticate("local")(req, res, function () {
           res.redirect("/");
         });
       }
     }
   );
});
  

module.exports = router;