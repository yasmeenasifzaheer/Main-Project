// routes/movieRoutes.js
import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
  getInTheaterMovies,
  addComment
} from "../controllers/movieController.js";
import { protect } from "../middleware/authMiddleware.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

const router = express.Router();

//////////////////////////////////////////
// MOVIE ROUTES
//////////////////////////////////////////

router.get("/", getMovies);
router.get("/in-theater", getInTheaterMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

//////////////////////////////////////////
// REVIEW ROUTES
//////////////////////////////////////////

// GET all reviews for a movie
// GET all reviews for a movie
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ comments: reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST a new review for a movie
router.post("/:id/comment", async (req, res) => {
  const { text, rating } = req.body;
  const movieId = req.params.id;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

   const { text, rating, userName } = req.body;

const review = new Review({
  movie: movie._id,
  userName: userName || "Anonymous",
  text,
  rating
});

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//////////////////////////////////////////
// LIKE / DISLIKE ROUTES
//////////////////////////////////////////

router.post("/reviews/:reviewId/reaction", async (req, res) => {
  try {
    const { type } = req.body;
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (type === "like") review.likes = (review.likes || 0) + 1;
    if (type === "dislike") review.dislikes = (review.dislikes || 0) + 1;

    await review.save();
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;