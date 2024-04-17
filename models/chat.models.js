const db = require("../database/dbMongoose");

const chatSchema = new db.mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    collection: "ChatMsg",
    versionKey: false,
  }
);

// Tạo model từ schema
const Chat = db.mongoose.model("Chat", chatSchema);

module.exports = Chat;
