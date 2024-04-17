const express = require("express");
const router = express.Router();
const apiChat = require("../api/apiChatMsg");

router.get("/chat", apiChat.getAllMessages);
router.post("/chat", apiChat.createMessage);

module.exports = router;
