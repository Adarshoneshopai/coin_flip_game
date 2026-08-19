import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("\n=======================================================");
    console.error("⚠️  MISSING MONGODB_URI IN ENVIRONMENT VARIABLES!");
    console.error("Please add your MongoDB Atlas URI in backend/.env:");
    console.error("MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/coin-flip-game?retryWrites=true&w=majority");
    console.error("=======================================================\n");
    return;
  }

  // Setup connection event listeners
  mongoose.connection.on("connected", () => {
    const isAtlas = uri.includes("mongodb+srv") || uri.includes("cluster");
    console.log(`✅ MongoDB Connected successfully! (${isAtlas ? "MongoDB Atlas Cloud" : mongoose.connection.host})`);
  });

  mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected. Attempting reconnection...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected successfully.");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  });

  mongoose.set("strictQuery", true);

  // Retry the initial connection with backoff instead of giving up after one
  // attempt — a single failed attempt (e.g. an Atlas IP whitelist update that
  // hasn't propagated yet, or a transient network blip) previously left the
  // API running but permanently unable to reach the database, since Mongoose
  // only auto-reconnects a connection that had already succeeded once.
  const RETRY_DELAY_MS = 5000;

  const attemptConnect = async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (err) {
      console.error("\n=======================================================");
      console.error(`❌ MongoDB Connection Failed: ${err.message}`);
      console.error("Check your MongoDB Atlas connection string, IP whitelist in Atlas, or network connection.");
      console.error(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      console.error("=======================================================\n");
      setTimeout(attemptConnect, RETRY_DELAY_MS);
    }
  };

  await attemptConnect();
};
