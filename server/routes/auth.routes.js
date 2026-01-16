const router = require("express").Router();
const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");

// route to signup a new user
router.post("/signup", async (req, res, next) => {
  try {
    // destructure the request body to get email, password, userName
    const { email, password, userName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(403).json({ errorMessage: "Email already taken" });
    } else {
      const theSalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, theSalt);
      const hashedUser = {
        ...req.body,
        password: hashedPassword,
      };
      const newUser = await User.create(hashedUser);
      res.status(201).json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

// route to login an existing user

module.exports = router;
