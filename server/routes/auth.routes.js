const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middlewares");
const { body, validationResult } = require("express-validator");

// Validation middleware
const validateSignup = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("userName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Username must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorMessage: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// route to signup a new user
router.post(
  "/signup",
  validateSignup,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      // destructure the request body to get email, password, userName
      const { email, password, userName } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(403).json({ errorMessage: "Email already taken" });
      }
      const theSalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, theSalt);
      const hashedUser = {
        email,
        password: hashedPassword,
        userName,
      };
      const newUser = await User.create(hashedUser);
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          email: newUser.email,
          userName: newUser.userName,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// route to login an existing user
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(403).json({ errorMessage: "Invalid credentials" });
      }
      const doesPasswordMatch = bcryptjs.compareSync(password, user.password);
      if (!doesPasswordMatch) {
        return res.status(403).json({ errorMessage: "Invalid credentials" });
      }
      const payload = {
        // don't put sensitive info in the token!
        _id: user._id,
      };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.status(200).json({
        message: "Login successful",
        user: { _id: user._id, email: user.email, userName: user.userName },
        token: authToken,
      });
    } catch (error) {
      next(error);
    }
  },
);

// this route verify the auth token
router.get("/verify", isAuthenticated, async (req, res, next) => {
  const currentLoggedInUser = await User.findById(req.payload._id).select(
    "-password",
  );
  res.status(200).json({ message: "Token is valid", currentLoggedInUser });
});

module.exports = router;
