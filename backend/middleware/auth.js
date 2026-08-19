import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Require valid JWT authentication
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no authentication token provided.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "dev_secret_key_change_in_production_123456";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User account associated with this token no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, invalid or expired token.",
    });
  }
};

// Optional JWT authentication: populates req.user if token is valid, proceeds either way
export const optionalAuth = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || "dev_secret_key_change_in_production_123456";
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }

  next();
};
