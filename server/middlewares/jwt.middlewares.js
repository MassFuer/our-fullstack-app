const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  // Check if authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ errorMessage: "No token provided" });
  }

  const parts = req.headers.authorization.split(" ");

  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ errorMessage: "Headers Malformed" });
  }

  const token = parts[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = decodedToken;
    next(); // Only call next() AFTER successful verification
  } catch (error) {
    return res.status(401).json({ errorMessage: "Invalid or expired token" });
  }
}

module.exports = { isAuthenticated };
