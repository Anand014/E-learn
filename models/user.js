const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    mycourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
  });
  
  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
  
  module.exports = new mongoose.model("User", userSchema);