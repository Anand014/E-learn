require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set('view engine', 'ejs');

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: "level5ofsecurityiscool.",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// UPLOAD IMAGE IN DATABASE------>

// const mongoURI = 'mongodb://localhost:27017/elearnDB';

// const conn = mongoose.createConnection(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });

// // Init gfs
// let gfs;

// conn.once("open", () => {
//     // Init stream
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("uploads");
// });

// // create storage engine
// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
//   const upload = multer({storage});

// mongoose.connect("mongodb://localhost:27017/elearnDB",{ useUnifiedTopology: true, useNewUrlParser: true } );

mongoose.connect("mongodb+srv://Anand:12345@yourblogdb.lhdpi.mongodb.net/blogDB",{ useUnifiedTopology: true, useNewUrlParser: true });

mongoose.set('useCreateIndex', true);

const courseSchema = {
    name: String,
    image: String,
    tablehead1: String,
    tablehead2: String,
    tablebody1: String,
    tablebody11 : String,
    tablebody12 : String,
    tablebody13 : String,
    tablebody2: String,
    tablebody21: String,
    tablebody22: String,
    tablebody23: String,
    price: String,
  };
  
const Course = mongoose.model("Course", courseSchema);

const userSchema = new mongoose.Schema ({
    name: String,
    email: String,
    password: String,
    googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  });

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login",isLoggedOut, function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/home", function(req, res){
    res.redirect("/");
});

app.get("/courses", function(req, res){
    Course.find({}, function(err, allcourses){
        if(err){
            console.log(err);
        } else {
            res.render("courses", {courses:allcourses});
        }
    });
});


app.get("/about", function(req, res){
    res.render("about");
});

app.get("/admin", function(req, res){
    res.render("admin");
});

app.post("/admin", function(req, res){
    const adminPassword = process.env.ADMIN_PASSWORD;
    const checkadminPassword = req.body.verify


    if ( checkadminPassword === adminPassword ) {
        res.render("newCourse");
    } else {
        res.redirect("admin");
    } 
});



app.post("/courses", function(req, res){
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
        price: price
    }
    
    Course.create(newCourse, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/courses");
        }
    });
    
});


app.get("/courses/:courseId", function(req, res){

    const requestedCourseId = req.params.courseId;
    
      Course.findOne({_id: requestedCourseId}, function(err, course){
        res.render("courseInfo", {
            name : course.name,
            image : course.image, 
            tablehead1 : course.tablehead1,
            tablehead2 : course.tablehead2, 
            tablebody1 : course.tablebody1,
            tablebody2 : course.tablebody2, 
            tablebody11 : course.tablebody11,
            tablebody21 : course.tablebody21, 
            tablebody12 : course.tablebody12,
            tablebody22 : course.tablebody22, 
            tablebody13 : course.tablebody13,
            tablebody23 : course.tablebody23,
            price : course.price
        });
      });
    });
    

app.post("/register", function(req, res){

    User.register({name: req.body.name, username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});


app.post("/login", function(req, res){
    const user = new User({
        name: req.body.name,
        username:  req.body.username,
        password : req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    })
});

app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});




//Middleware --> Checking user is authenticated or not
function isLoggedOut(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}


app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("The server has started at port 3000.");
  });
