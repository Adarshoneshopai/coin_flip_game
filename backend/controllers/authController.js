import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes, single-use

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "dev_secret_key_change_in_production_123456";
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide your name, email address, and a password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email address already exists. Please log in.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully!",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please continue with Google to log in.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Logged in successfully!",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me (Protected)
export const getMe = async (req, res, next) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    res.json({
      message: "Logged out successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/google
// Body: { credential } — the signed ID token from Google Identity Services'
// "Sign in with Google" button (frontend-only OAuth 2.0 / OIDC flow, no
// server-side redirect or callback route involved).
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential." });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not configured on the server.");
      return res.status(500).json({
        message: "Google Sign-In is not configured on this server.",
      });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({
        message: "Google sign-in failed — the credential could not be verified.",
      });
    }

    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ message: "Google sign-in failed. Please try again." });
    }

    if (payload.email_verified === false) {
      return res.status(401).json({
        message: "Your Google account's email address is not verified.",
      });
    }

    const normalizedEmail = payload.email.toLowerCase().trim();

    // Look up by Google ID first (stable, unique); fall back to email so an
    // existing password-based account gets linked instead of duplicated.
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
      if (user && !user.googleId) {
        user.googleId = payload.sub;
        await user.save({ validateBeforeSave: false });
      }
    }

    if (!user) {
      user = await User.create({
        name: payload.name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId: payload.sub,
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Logged in successfully!",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// A single generic message for both branches of forgotPassword — never
// reveals whether an email address has an account (prevents enumeration).
const GENERIC_FORGOT_PASSWORD_MESSAGE =
  "If an account exists for that email address, a password reset link has been sent.";

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordTokenHash = hashToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await user.save({ validateBeforeSave: false });

      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
      const resetLink = `${frontendUrl}/?resetToken=${rawToken}`;

      try {
        await sendPasswordResetEmail(user.email, resetLink);
      } catch (emailErr) {
        // Roll back the token if we couldn't actually deliver it, so a
        // failed send doesn't leave a dangling, unusable-but-valid token.
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.error("Failed to send password reset email:", emailErr.message);
      }
    }

    // Always the same response, whether or not the email was registered.
    res.json({ message: GENERIC_FORGOT_PASSWORD_MESSAGE });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordTokenHash +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password = password; // re-hashed by the pre-save hook, same as signup
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined; // invalidate — single use
    await user.save();

    res.json({ message: "Your password has been reset successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
};
