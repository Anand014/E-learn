const express = require("express");
const Course = require("../models/courses");
const User = require("../models/user");
const passport = require("passport");
const { route, use } = require("./editProfile");
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
  if( req.user ){
    const usercourses = req.user.mycourses;
    console.log("EnrolledCoursesId:\n" + usercourses);
    console.log("IndexOf:\n" + usercourses.indexOf(requestedCourseId));
        if(usercourses.indexOf(requestedCourseId) != -1)
        {
          Course.findOne({ _id: requestedCourseId }, function (err, course) {
            res.render("courseInfo", {
              course : course,
              courseidtoPush: requestedCourseId,
              checkEnrolled: true
            });
        });
        }
        else{
          Course.findOne({ _id: requestedCourseId }, function (err, course) {
            res.render("courseInfo", {
              course : course,
              courseidtoPush: requestedCourseId,
              checkEnrolled: false
            });
        });
        }
  } else {
    Course.findOne({ _id: requestedCourseId }, function (err, course) {
      res.render("courseInfo", {
        course : course,
        courseidtoPush: requestedCourseId,
        checkEnrolled: false
      });
   });
  }
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
  res.redirect("/mycourses")
});

module.exports = router;