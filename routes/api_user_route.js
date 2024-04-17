const express = require("express");
const router = express.Router();
const apiUser = require("../api/apiUser");

router.get("/user", apiUser.getAllUser);
router.post("/user", apiUser.createUser);

module.exports = router;
