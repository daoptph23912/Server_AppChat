const db = require("../database/dbMongoose");
const userSchema = new db.mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {},
    email: {
      type: String,
      require: true,
    },
  },
  {
    collection: "User",
    versionKey: false,
  }
);

const User = db.mongoose.model("userModel", userSchema);

module.exports = User;
