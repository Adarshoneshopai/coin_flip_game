import mongoose from "mongoose";

const flipSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
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

// Fast lookup of a session's most recent flips
flipSchema.index({ sessionId: 1, createdAt: -1 });

export default mongoose.model("Flip", flipSchema);
