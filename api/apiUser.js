const User = require("../models/user.model");

exports.getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
    console.log("Users retrieved successfully:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting User:", error);
    res.status(500).json({ error: "Error getting User" });
  }
};
exports.createUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create a new user
    const newUser = new User({ username, password, email });
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
