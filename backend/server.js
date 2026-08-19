import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import flipRoutes from "./routes/flipRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
  })
);
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Basic abuse protection: caps flips per IP so the game (and AdSense-visible
// pages) can't be hammered by scripted requests.
const flipLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many flips — slow down and try again shortly." },
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/flips", flipLimiter, flipRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
});
