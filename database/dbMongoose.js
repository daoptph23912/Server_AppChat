const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/ChatAppBkav").catch((err) => {
  console.log("Error");
  console.log(err);
});

module.exports = { mongoose };
// mongodb://localhost:27017/?directC
