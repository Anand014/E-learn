const mongoose = require("mongoose");

const courseSchema = {
    name: String,
    image: String,
    tablehead1: String,
    tablehead2: String,
    tablebody1: String,
    tablebody11: String,
    tablebody12: String,
    tablebody13: String,
    tablebody2: String,
    tablebody21: String,
    tablebody22: String,
    tablebody23: String,
    video: String,
    price: String,
    checkEnrolled: { type: Boolean, default: false }
  };
  
module.exports = mongoose.model("Course", courseSchema);