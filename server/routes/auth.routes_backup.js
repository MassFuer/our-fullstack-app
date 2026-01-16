const router = require("express").Router();
const User = require("../models/User.model");


// a /signup route to create a new user with email, password, userName
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, userName, profilePicture } = req.body;
    // add validation to check if email, password, userName are provided
    if (!email || !password || !userName) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    // create a new user
    const newUser = await User.create({ email, password, userName, profilePicture });
    // return the user without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});


// a /login route to authenticate a user with email and password
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // add validation to check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    // find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    // check if the password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password." });
    }
    // return the user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
