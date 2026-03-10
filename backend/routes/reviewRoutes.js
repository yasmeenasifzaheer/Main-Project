import express from "express";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST a review for a movie
router.post("/:id/comment", protect, async (req, res) => {
  const { text, rating } = req.body;
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).json({ message: "Movie not found" });

  const review = new Review({
    movie: movie._id,
    user: req.user._id,
    userName: req.user.name,
    text,
    rating
  });

  await review.save();
  res.status(201).json(review);
});
export default router;