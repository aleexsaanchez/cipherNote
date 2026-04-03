// routes/authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET = "secretkey"; // move to process.env later for security

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id; // attach userId to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};