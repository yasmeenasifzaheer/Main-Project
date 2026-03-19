import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";
import Review from "./models/Review.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected");

  const reviews = await Review.find();

  for (let r of reviews) {
  const movie = await Movie.findById(r.movie);

  // ❌ If movie not found → skip
  if (!movie) {
    console.log("Movie not found for review:", r.text);
    continue;
  }

  if (!movie.comments) {
    movie.comments = [];
  }

  movie.comments.push({
    user: r.userName || "Anonymous",
    text: r.text,
    likes: r.likes || 0,
    dislikes: r.dislikes || 0,
  });

  await movie.save();
}
  

  console.log("✅ Old reviews moved!");
  process.exit();
};

run();