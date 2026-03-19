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
// GET all reviews for a movie
// GET all reviews for a movie
router.get("/:id/reviews", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 🔹 1️⃣ Old comments from movie.userReviews.comments
    let oldComments = [];
    if (movie?.userReviews?.comments?.length) {
      oldComments = movie.userReviews.comments.map((c) => ({
        userName: c.user || "Anonymous",
        text: c.text || "",
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
      }));
    }

    // 🔹 2️⃣ Optional fallback: if someone used movie.comments field
    if (!oldComments.length && movie?.comments?.length) {
      oldComments = movie.comments.map((c) => ({
        userName: c.user || "Anonymous",
        text: c.text || "",
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
      }));
    }

    // 🔹 3️⃣ New comments from Review collection
    const dbReviews = await Review.find({ movie: req.params.id });
    const formattedDbReviews = dbReviews.map((r) => ({
      userName: r.userName || "Anonymous",
      text: r.text || "",
      likes: r.likes || 0,
      dislikes: r.dislikes || 0,
      createdAt: r.createdAt
    }));

    // 🔹 4️⃣ Merge old + new comments
    const allComments = [...formattedDbReviews, ...oldComments];

    // 🔹 5️⃣ Sort latest first
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 🔹 6️⃣ Return merged comments
    res.json({ comments: allComments });

  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// POST a new review for a movie
// POST a new review for a movie
router.post("/:id/comment", async (req, res) => {
  const { text, rating } = req.body;

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 🔥 Save ONLY in Review collection
    const newReview = new Review({
      movie: movie._id,
      text,
      rating: rating || 0,
      userName: "Anonymous" // or later from auth
    });

    await newReview.save();

    res.status(201).json(newReview);

  } catch (err) {
    console.error("POST COMMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
//////////////////////////////////////////
// LIKE / DISLIKE ROUTES
//////////////////////////////////////////

// router.post("/reviews/:reviewId/reaction", async (req, res) => {
//   try {
//     const { type } = req.body;
//     const review = await Review.findById(req.params.reviewId);
//     if (!review) return res.status(404).json({ message: "Review not found" });

//     if (type === "like") review.likes = (review.likes || 0) + 1;
//     if (type === "dislike") review.dislikes = (review.dislikes || 0) + 1;

//     await review.save();
//     res.json({ likes: review.likes, dislikes: review.dislikes });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;