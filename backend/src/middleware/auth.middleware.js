const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {

  try {

    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        error: "Authorization header missing"
      });
    }

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format"
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token missing"
      });
    }

    let decoded;

    try {

      decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (err) {

      console.error("JWT VERIFY ERROR:", err.message);

      return res.status(401).json({
        error: "Invalid token",
        reason: err.message
      });

    }

    const user = await User
      .findById(decoded.id)
      .select("-password");

    if (!user) {

      return res.status(401).json({
        error: "User not found"
      });

    }

    req.user = user;

    next();

  } catch (err) {

    console.error("AUTH MIDDLEWARE ERROR:", err);

    return res.status(401).json({
      error: "Authentication failed"
    });

  }

};