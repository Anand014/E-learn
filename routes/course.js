const express = require("express");
const Course = require("../models/courses");
const User = require("../models/user");
const passport = require("passport");
const { route } = require("./editProfile");
const middleware = require("../middleware");
const router = express.Router();


router.get("/", function (req, res) {
   Course.find({}, function (err, allcourses) {
     if (err) {
       console.log(err);
     } else {
       res.render("courses", { courses: allcourses });
     }
   });
});

router.post("/", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const tablehead1 = req.body.tablehead1;
    const tablehead2 = req.body.tablehead2;
    const tablebody1 = req.body.tablebody1;
    const tablebody11 = req.body.tablebody11;
    const tablebody12 = req.body.tablebody12;
    const tablebody13 = req.body.tablebody13;
    const tablebody2 = req.body.tablebody2;
    const tablebody21 = req.body.tablebody21;
    const tablebody22 = req.body.tablebody22;
    const tablebody23 = req.body.tablebody23;
    const video = req.body.video;
    const price = req.body.price;
  
    const newCourse = {
      name: name,
      image: image,
      tablehead1: tablehead1,
      tablehead2: tablehead2,
      tablebody1: tablebody1,
      tablebody11: tablebody11,
      tablebody12: tablebody12,
      tablebody13: tablebody13,
      tablebody2: tablebody2,
      tablebody21: tablebody21,
      tablebody22: tablebody22,
      tablebody23: tablebody23,
      video: video,
      price: price
    };
  
    Course.create(newCourse, function (err, newlycreated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/courses");
      }
  });
});

router.get("/:courseId", function (req, res) {
    const requestedCourseId = req.params.courseId;
  
    Course.findOne({ _id: requestedCourseId }, function (err, course) {
      res.render("courseInfo", {
        name: course.name,
        image: course.image,
        tablehead1: course.tablehead1,
        tablehead2: course.tablehead2,
        tablebody1: course.tablebody1,
        tablebody2: course.tablebody2,
        tablebody11: course.tablebody11,
        tablebody21: course.tablebody21,
        tablebody12: course.tablebody12,
        tablebody22: course.tablebody22,
        tablebody13: course.tablebody13,
        tablebody23: course.tablebody23,
        price: course.price,
        courseidtoPush: requestedCourseId
      });
   });
});

router.post("/:courseidtoPush/mycourses",middleware.isLoggedIn, function(req, res){
    const pushCourse = req.params.courseidtoPush;
  
    User.findById(req.user.id, function(err, foundUser){
      if(err) {
          console.log(err);
      } else {
          if(foundUser){
              foundUser.mycourses.push(pushCourse);
              foundUser.save(function(){
                  console.log("Course Added");
              });
          }
      }
  });
  res.redirect("/")
});

module.exports = router;