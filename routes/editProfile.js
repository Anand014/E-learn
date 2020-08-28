const express = require("express");
const User = require("../models/user");
const middleware = require("../middleware");
const router = express.Router();

router.get("/",middleware.isLoggedIn, function(req, res){
    res.render("editProfile");
  });
  
router.post("/",middleware.isLoggedIn, function(req, res){
  const userName = req.body.username;
  
    User.updateOne({_id: req.user._id},{
      name: userName 
    }, function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  });
  
  module.exports = router;