const router = require("express").Router();
const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

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
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(403).json({ errorMessage: "Email not in DB" });
    } else {
      const doesPasswordMatch = bcryptjs.compareSync(password, user.password);
      if (doesPasswordMatch) {
        const payload = {
          // don't put sensitive info in the token!
          _id: user._id,
        };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({
          message: "Congrats, you are now logged in!",
          user,
          token: authToken,
        });
      } else {
        res.status(403).json({ errorMessage: "Invalid credentials" });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
