const jwt = require("jsonwebtoken");
const User = require("../models/User"); // import User model

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)

    // fetch full user from DB
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // full user now available including email
    // console.log(req.user)
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
