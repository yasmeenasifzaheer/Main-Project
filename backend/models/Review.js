import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: String,
    rating: Number,
    text: String // ✅ changed from comment to match frontend
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);