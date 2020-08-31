require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const User = require("./models/user");
const Course = require("./models/courses");
const editProfileRoutes = require("./routes/editProfile");
const login = require("./routes/login");
const register = require("./routes/register");
const course = require("./routes/course");
const admin = require("./routes/admin");
const middleware = require("./middleware");

const app = express();

app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "level5ofsecurityiscool.",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/editProfile",editProfileRoutes);
app.use("/login",login);
app.use("/register",register);
app.use("/courses",course);
app.use("/admin",admin);

// mongoose.connect("mongodb://localhost:27017/elearnDB",{ useUnifiedTopology: true, useNewUrlParser: true } );

mongoose.connect("mongodb+srv://Anand:12345@yourblogdb.lhdpi.mongodb.net/blogDB",{ useUnifiedTopology: true, useNewUrlParser: true });

mongoose.set("useCreateIndex", true);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://elearnv2.herokuapp.com/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/home", function (req, res) {
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about");
});


app.get("/mycourses",middleware.isLoggedIn, function(req, res){

  User.findById(req.user.id).populate('mycourses').exec(function(err, user){
    if(err){
      console.log(err);
    }  else { 
      res.render("mycourses", { user : user});
    }
  });
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("The server has started at port 3000.");
});


