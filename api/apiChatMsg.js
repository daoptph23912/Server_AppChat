const Chat = require("../models/chat.models");
// Tạo mới một tin nhắn

// Lấy tất cả tin nhắn
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Chat.find();
    console.log("Messages retrieved successfully:", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Error getting messages" });
  }
};
exports.createMessage = async (req, res, next) => {
  try {
    const { content, username } = req.body;
    const newMessage = await Chat.create({ content, username });
    console.log("Message created successfully:", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Error creating message" });
  }
};
