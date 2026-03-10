// controllers/movieController.js
import Movie from "../models/Movie.js";

// GET all movies
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create movie (without uploads)
export const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET In-Theater Movies
export const getInTheaterMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ inTheater: true });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    const { user, text, rating } = req.body;

    movie.userReviews.comments.push({
      user,
      text,
      rating,
      likes: 0,
      dislikes: 0,
      createdAt: new Date()
    });

    await movie.save();

    res.json(movie.userReviews.comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};