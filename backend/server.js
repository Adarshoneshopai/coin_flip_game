import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import flipRoutes from "./routes/flipRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "20kb" }));

// Dynamic CORS configuration
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf("*") !== -1 || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow in dev for smooth local proxying
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiter for game flips
const flipLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many flips — slow down and try again shortly." },
});

// Rate limiter for authentication endpoints (anti-brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login/signup attempts. Please try again in 15 minutes." },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/flips", flipLimiter, flipRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

//const PORT = process.env.PORT || 5000;

// // Initialize Database & Start Server
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 API Server running on port ${PORT}`);
//     console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
//   });
// });

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
    });
  });
} else {
  connectDB();
}

export default app;
