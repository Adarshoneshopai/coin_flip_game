import mongoose from "mongoose";

const flipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    sessionId: {
      type: String,
      required: false,
      index: true,
    },
    choice: {
      type: String,
      enum: ["heads", "tails"],
      required: true,
    },
    result: {
      type: String,
      enum: ["heads", "tails"],
      required: true,
    },
    win: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

// Fast lookup of an authenticated user's or session's flips
flipSchema.index({ userId: 1, createdAt: -1 });
flipSchema.index({ sessionId: 1, createdAt: -1 });

export default mongoose.model("Flip", flipSchema);
